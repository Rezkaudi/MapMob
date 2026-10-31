import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LiveOwnerQuotaSummary } from '../../../shared/data/live-owner-quota-summary';
import { ownerPlanOf } from '../../../shared/data/owner-plan-of';
import { readAllOwnerPages } from '../../../shared/data/read-all-owner-pages';
import { NamedReference } from '../../../shared/models/named-reference';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { StoryDraft } from '../models/story-draft';
import { LiveOwnerStory } from './live-owner-story';
import { MerchantStoriesRepository } from './merchant-stories.repository';
import { toNewStoryFormData, toStoryUpdateFormData } from './merchant-stories-form-data';
import { toMerchantStory } from './to-merchant-story';

@Injectable()
export class MerchantStoriesHttpRepository implements MerchantStoriesRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);
  private readonly storiesUrl = `${this.apiBaseUrl}/owner/stories`;

  getLibrary(): Observable<MerchantStoryLibrary> {
    return forkJoin({
      summary: this.httpClient
        .get<LiveEnvelope<LiveOwnerQuotaSummary>>(`${this.storiesUrl}/summary`)
        .pipe(map(({ data }) => data)),
      place: this.httpClient
        .get<LiveEnvelope<{ place: NamedReference }>>(`${this.apiBaseUrl}/owner/overview/summary`)
        .pipe(map(({ data }) => ({ id: data.place.id, name: data.place.name }))),
      stories: readAllOwnerPages<LiveOwnerStory>(this.httpClient, this.storiesUrl),
    }).pipe(
      map(({ summary, place, stories }) => ({
        plan: ownerPlanOf(summary),
        place,
        activeStoryLimit: summary.quota.limit,
        items: stories.map(toMerchantStory),
      })),
    );
  }

  addStory(draft: StoryDraft): Observable<MerchantStory> {
    return this.saveStory(this.storiesUrl, toNewStoryFormData(draft));
  }

  updateStory(id: string, draft: StoryDraft): Observable<MerchantStory> {
    return this.saveStory(`${this.storiesUrl}/${id}`, toStoryUpdateFormData(draft));
  }

  deleteStory(id: string): Observable<void> {
    return this.httpClient.delete<unknown>(`${this.storiesUrl}/${id}`).pipe(map(() => undefined));
  }

  private saveStory(url: string, body: FormData): Observable<MerchantStory> {
    return this.httpClient
      .post<LiveEnvelope<LiveOwnerStory>>(url, body)
      .pipe(map(({ data }) => toMerchantStory(data)));
  }
}
