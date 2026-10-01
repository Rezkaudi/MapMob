import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { StoryDraft } from '../models/story-draft';
import { toStoryFormData } from './merchant-stories-form-data';
import { MerchantStoriesRepository } from './merchant-stories.repository';

@Injectable()
export class MerchantStoriesHttpRepository implements MerchantStoriesRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly storiesUrl = `${inject(API_BASE_URL)}/owner/stories`;

  getLibrary(): Observable<MerchantStoryLibrary> {
    return this.httpClient.get<MerchantStoryLibrary>(this.storiesUrl);
  }

  addStory(draft: StoryDraft): Observable<MerchantStory> {
    return this.httpClient.post<MerchantStory>(this.storiesUrl, toStoryFormData(draft));
  }

  updateStory(id: string, draft: StoryDraft): Observable<MerchantStory> {
    return this.httpClient.put<MerchantStory>(`${this.storiesUrl}/${id}`, toStoryFormData(draft));
  }

  deleteStory(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.storiesUrl}/${id}`);
  }
}
