import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LIVE_STORY } from '../testing/live-story-fixture';
import { StoryHttpRepository } from './story-http.repository';

const STORIES_URL = 'https://api.test/admin/stories';
const ACTIVE_STORY = { ...LIVE_STORY, id: 3, status: 'active', store: { id: 4, name: 'حلب' } };

describe('StoryHttpRepository', () => {
  let repository: StoryHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        StoryHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: 'https://api.test' },
      ],
    });
    repository = TestBed.inject(StoryHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks the server for one page of one status and shows it as it comes', async () => {
    const response = firstValueFrom(
      repository.getStories({ pageIndex: 1, pageSize: 10, status: 'expired', search: 'حلب' }),
    );

    const request = http.expectOne((call) => call.url === STORIES_URL);
    expect(request.request.params.get('status')).toBe('expired');
    expect(request.request.params.get('search')).toBe('حلب');
    expect(request.request.params.get('page')).toBe('2');
    expect(request.request.params.get('per_page')).toBe('10');
    request.flush({ data: [LIVE_STORY, ACTIVE_STORY], pagination: { total: 12 } });

    const page = await response;
    expect(page.totalCount).toBe(12);
    expect(page.items.map((story) => story.id)).toEqual(['2', '3']);
  });

  it('reads "all" in one call without a status', () => {
    repository.getStories({ pageIndex: 0, pageSize: 10 }).subscribe();

    const request = http.expectOne((call) => call.url === STORIES_URL);
    expect(request.request.params.has('status')).toBe(false);
    request.flush({ data: [], pagination: { total: 0 } });
  });

  it('reads the summary', async () => {
    const response = firstValueFrom(repository.getSummary());

    http
      .expectOne(`${STORIES_URL}/summary`)
      .flush({ data: { total: 2, active: 0, hidden: 1, expired: 1 } });

    expect((await response).hiddenCount).toBe(1);
  });

  it('flips the visibility with PATCH', async () => {
    const response = firstValueFrom(repository.setStoryHidden('9'));

    http.expectOne({ method: 'PATCH', url: `${STORIES_URL}/9/visibility` }).flush({});

    expect(await response).toBeUndefined();
  });

  it('deletes a story', async () => {
    const response = firstValueFrom(repository.deleteStory('9'));

    http.expectOne({ method: 'DELETE', url: `${STORIES_URL}/9` }).flush({});

    expect(await response).toBeUndefined();
  });

  it('downloads the export file from the server, with the filters and the ticked rows', async () => {
    const file = new Blob(['ID'], { type: 'text/csv' });
    const response = firstValueFrom(
      repository.exportStories({
        query: { pageIndex: 0, pageSize: 10, status: 'expired', search: 'حلب' },
        ids: ['2', '5'],
      }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${STORIES_URL}/export`);
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('status')).toBe('expired');
    expect(request.request.params.get('search')).toBe('حلب');
    expect(request.request.params.getAll('ids[]')).toEqual(['2', '5']);
    request.flush(file);

    expect(await response).toBe(file);
  });
});
