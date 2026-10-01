import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildStoryEntry, buildStorySummary } from '../testing/story-fixture';
import { StoryHttpRepository } from './story-http.repository';

const STORIES_URL = 'https://api.test/stories';

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

  it('reads one page with the search and the status', async () => {
    const response = firstValueFrom(
      repository.getStories({ pageIndex: 1, pageSize: 4, search: 'كافيه', status: 'active' }),
    );

    const request = http.expectOne((candidate) => candidate.url === STORIES_URL);
    expect(request.request.method).toBe('GET');
    expect(request.request.params.get('pageIndex')).toBe('1');
    expect(request.request.params.get('pageSize')).toBe('4');
    expect(request.request.params.get('search')).toBe('كافيه');
    expect(request.request.params.get('status')).toBe('active');
    request.flush({ items: [buildStoryEntry()], totalCount: 1 });
    expect((await response).totalCount).toBe(1);
  });

  it('reads the numbers of the cards and the chips', async () => {
    const response = firstValueFrom(repository.getSummary());

    const request = http.expectOne(`${STORIES_URL}/summary`);
    expect(request.request.method).toBe('GET');
    request.flush(buildStorySummary());
    expect((await response).hiddenCount).toBe(1);
  });

  it('hides or shows a story with a PATCH on its visibility', async () => {
    const response = firstValueFrom(repository.setStoryHidden('9', true));

    const request = http.expectOne(`${STORIES_URL}/9/visibility`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ isHidden: true });
    request.flush(buildStoryEntry({ id: '9', status: 'hidden' }));
    expect((await response).status).toBe('hidden');
  });

  it('deletes a story by its id', async () => {
    const response = firstValueFrom(repository.deleteStory('9'), { defaultValue: undefined });

    const request = http.expectOne(`${STORIES_URL}/9`);
    expect(request.request.method).toBe('DELETE');
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });

  it('downloads the export with the filters and the ticked rows as ids[], never the page', async () => {
    const response = firstValueFrom(
      repository.exportStories({
        query: { pageIndex: 3, pageSize: 4, search: 'كافيه', status: 'expired' },
        ids: ['4', '9'],
      }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${STORIES_URL}/export`);
    expect(request.request.method).toBe('GET');
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.keys().sort()).toEqual(['ids[]', 'search', 'status']);
    expect(request.request.params.getAll('ids[]')).toEqual(['4', '9']);
    request.flush(new Blob(['csv']));
    expect((await response).size).toBe(3);
  });
});
