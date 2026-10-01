import { Observable } from 'rxjs';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { StoryDraft } from '../models/story-draft';

export abstract class MerchantStoriesRepository {
  abstract getLibrary(): Observable<MerchantStoryLibrary>;
  abstract addStory(draft: StoryDraft): Observable<MerchantStory>;
  abstract updateStory(id: string, draft: StoryDraft): Observable<MerchantStory>;
  abstract deleteStory(id: string): Observable<void>;
}
