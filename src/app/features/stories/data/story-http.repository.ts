import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { toLiveFilterParams } from '../../../core/http/live-filter-params';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { withPageNumber } from '../../../core/http/live-page-number-params';
import { LivePaginationPage } from '../../../core/http/live-pagination-page';
import { StoryExportRequest } from '../models/story-export-request';
import { StoryPage } from '../models/story-page';
import { StoryQuery } from '../models/story-query';
import { StorySummary } from '../models/story-summary';
import { LiveStory } from './live-story';
import { LiveStorySummary, toStoryEntry, toStorySummary } from './live-story-mapping';
import { StoryRepository } from './story.repository';

@Injectable()
export class StoryHttpRepository implements StoryRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly storiesUrl = `${inject(API_BASE_URL)}/admin/stories`;

  getStories(query: StoryQuery): Observable<StoryPage> {
    return this.httpClient
      .get<LivePaginationPage<LiveStory>>(this.storiesUrl, {
        params: withPageNumber(this.toFilters(query), query),
      })
      .pipe(
        map((page) => ({
          items: page.data.map(toStoryEntry),
          totalCount: page.pagination.total,
        })),
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

  exportStories({ query, ids }: StoryExportRequest): Observable<Blob> {
    let params = this.toFilters(query);
    for (const id of ids) {
      params = params.append('ids[]', id);
    }
    return this.httpClient.get(`${this.storiesUrl}/export`, { params, responseType: 'blob' });
  }

  private toFilters(query: StoryQuery): HttpParams {
    return toLiveFilterParams({ status: query.status, search: query.search?.trim() });
  }
}
