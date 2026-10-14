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

  function answerStatus(status: string, rows: readonly unknown[]): void {
    http
      .expectOne(
        (request) => request.url === STORIES_URL && request.params.get('status') === status,
      )
      .flush({ data: rows, pagination: { total: rows.length } });
  }

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

  it('reads one status the server can list', async () => {
    const response = firstValueFrom(
      repository.getStories({ pageIndex: 0, pageSize: 10, status: 'expired' }),
    );
    answerStatus('expired', [LIVE_STORY]);

    expect((await response).items.map((story) => story.id)).toEqual(['2']);
  });

  it('shows "all" as the active and the expired stories, searched here', async () => {
    const response = firstValueFrom(
      repository.getStories({ pageIndex: 0, pageSize: 10, search: 'حلب' }),
    );
    answerStatus('active', [ACTIVE_STORY]);
    answerStatus('expired', [LIVE_STORY]);

    const page = await response;
    expect(page.totalCount).toBe(1);
    expect(page.items[0].id).toBe('3');
  });

  it('explains that the server cannot list hidden stories yet', async () => {
    const response = firstValueFrom(
      repository.getStories({ pageIndex: 0, pageSize: 10, status: 'hidden' }),
    );

    await expect(response).rejects.toThrow('القصص المخفية');
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

  it('exports the ticked rows from what the server can list', async () => {
    const response = firstValueFrom(
      repository.exportStories({ query: { pageIndex: 0, pageSize: 10 }, ids: ['2'] }),
    );
    answerStatus('active', [ACTIVE_STORY]);
    answerStatus('expired', [LIVE_STORY]);

    expect((await response).type).toContain('text/csv');
  });
});
