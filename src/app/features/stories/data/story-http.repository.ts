import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { StoryEntry } from '../models/story-entry';
import { StoryExportRequest } from '../models/story-export-request';
import { StoryPage } from '../models/story-page';
import { StoryQuery } from '../models/story-query';
import { StorySummary } from '../models/story-summary';
import { toStoryFilterParams, toStoryQueryParams } from './story-query-params';
import { StoryRepository } from './story.repository';

/** Arrays go out in the `name[]` form the API reference asks for. */
const IDS_PARAM = 'ids[]';

@Injectable()
export class StoryHttpRepository implements StoryRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly storiesUrl = `${inject(API_BASE_URL)}/stories`;

  getStories(query: StoryQuery): Observable<StoryPage> {
    return this.httpClient.get<StoryPage>(this.storiesUrl, { params: toStoryQueryParams(query) });
  }

  getSummary(): Observable<StorySummary> {
    return this.httpClient.get<StorySummary>(`${this.storiesUrl}/summary`);
  }

  setStoryHidden(id: string, isHidden: boolean): Observable<StoryEntry> {
    return this.httpClient.patch<StoryEntry>(`${this.storiesUrl}/${id}/visibility`, { isHidden });
  }

  deleteStory(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.storiesUrl}/${id}`);
  }

  exportStories({ query, ids }: StoryExportRequest): Observable<Blob> {
    let params = toStoryFilterParams(query);
    for (const id of ids) {
      params = params.append(IDS_PARAM, id);
    }
    return this.httpClient.get(`${this.storiesUrl}/export`, { params, responseType: 'blob' });
  }
}
