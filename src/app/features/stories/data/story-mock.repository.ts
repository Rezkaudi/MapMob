import { Injectable, inject } from '@angular/core';
import { Observable, from, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { StoryEntry } from '../models/story-entry';
import { StoryExportRequest } from '../models/story-export-request';
import { StoryPage } from '../models/story-page';
import { StoryQuery } from '../models/story-query';
import { StorySummary } from '../models/story-summary';
import type { StoryMockDatabase } from './story-mock-database';
import { StoryRepository } from './story.repository';

@Injectable()
export class StoryMockRepository implements StoryRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed stays out of the initial bundle.
  private readonly database$ = from(this.openDatabase()).pipe(shareReplay(1));

  getStories(query: StoryQuery): Observable<StoryPage> {
    return this.run((database) => database.page(query));
  }

  getSummary(): Observable<StorySummary> {
    return this.run((database) => database.summary());
  }

  setStoryHidden(id: string, isHidden: boolean): Observable<StoryEntry> {
    return this.run((database) => database.setHidden(id, isHidden));
  }

  deleteStory(id: string): Observable<void> {
    return this.run((database) => database.remove(id));
  }

  exportStories(request: StoryExportRequest): Observable<Blob> {
    return this.run((database) => database.exportedFile(request));
  }

  private async openDatabase(): Promise<StoryMockDatabase> {
    const [{ StoryMockDatabase }, { buildStoryMockSeed }] = await Promise.all([
      import('./story-mock-database'),
      import('./story-mock-seed'),
    ]);
    return new StoryMockDatabase(buildStoryMockSeed(this.clock()), this.clock);
  }

  private run<T>(work: (database: StoryMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
