import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, throwError } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { paginate } from '../../../shared/lists/paginate';
import { StoryStatus } from '../../../shared/models/story-status';
import { StoryEntry } from '../models/story-entry';
import { StoryExportRequest } from '../models/story-export-request';
import { StoryPage } from '../models/story-page';
import { StoryQuery } from '../models/story-query';
import { StorySummary } from '../models/story-summary';
import { buildStoriesCsvFile } from './stories-csv';
import { LiveStory } from './live-story';
import { LiveStorySummary, toStoryEntry, toStorySummary } from './live-story-mapping';
import { StoryRepository } from './story.repository';

const ALL_ROWS_PAGE_SIZE = 1000;
// Listing a hidden story makes the server fail, so only these two statuses can be read.
const LISTABLE_STATUSES: readonly StoryStatus[] = ['active', 'expired'];
const HIDDEN_LIST_MESSAGE = 'الخادم لا يعرض القصص المخفية حالياً. عددها ظاهر في البطاقات أعلاه.';

@Injectable()
export class StoryHttpRepository implements StoryRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly storiesUrl = `${inject(API_BASE_URL)}/admin/stories`;

  getStories(query: StoryQuery): Observable<StoryPage> {
    if (query.status === 'hidden') {
      return throwError(() => new Error(HIDDEN_LIST_MESSAGE));
    }
    return this.loadMatching(query).pipe(
      map((stories) => paginate(stories, query.pageIndex, query.pageSize)),
    );
  }

  getSummary(): Observable<StorySummary> {
    return this.httpClient
      .get<LiveEnvelope<LiveStorySummary>>(`${this.storiesUrl}/summary`)
      .pipe(map(({ data }) => toStorySummary(data)));
  }

  // The route flips the visibility; the panel only offers the flip that makes sense.
  setStoryHidden(id: string): Observable<void> {
    return this.httpClient
      .patch(`${this.storiesUrl}/${id}/visibility`, {})
      .pipe(map(() => undefined));
  }

  deleteStory(id: string): Observable<void> {
    return this.httpClient.delete(`${this.storiesUrl}/${id}`).pipe(map(() => undefined));
  }

  // The server's own file comes back empty, so the file is built from the rows it can list.
  exportStories({ query, ids }: StoryExportRequest): Observable<Blob> {
    return this.loadMatching(query).pipe(
      map((stories) =>
        buildStoriesCsvFile(
          ids.length ? stories.filter((story) => ids.includes(story.id)) : stories,
        ),
      ),
    );
  }

  private loadMatching(query: StoryQuery): Observable<readonly StoryEntry[]> {
    const statuses = query.status ? [query.status] : LISTABLE_STATUSES;
    const search = query.search?.trim() ?? '';
    return forkJoin(statuses.map((status) => this.loadStatus(status))).pipe(
      map((lists) =>
        lists
          .flat()
          .filter((story) => story.place.name.includes(search))
          .sort((left, right) => right.publishedAt.localeCompare(left.publishedAt)),
      ),
    );
  }

  private loadStatus(status: StoryStatus): Observable<readonly StoryEntry[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LiveStory[]>>(this.storiesUrl, {
        params: { status, per_page: ALL_ROWS_PAGE_SIZE },
      })
      .pipe(map(({ data }) => data.map(toStoryEntry)));
  }
}
