import { Observable } from 'rxjs';
import { StoryExportRequest } from '../models/story-export-request';
import { StoryPage } from '../models/story-page';
import { StoryQuery } from '../models/story-query';
import { StorySummary } from '../models/story-summary';

export abstract class StoryRepository {
  abstract getStories(query: StoryQuery): Observable<StoryPage>;
  abstract getSummary(): Observable<StorySummary>;
  abstract setStoryHidden(id: string, isHidden: boolean): Observable<void>;
  abstract deleteStory(id: string): Observable<void>;
  abstract exportStories(request: StoryExportRequest): Observable<Blob>;
}
