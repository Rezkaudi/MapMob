import { Injectable, inject } from '@angular/core';
import { Observable, from, map, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { MerchantStory } from '../models/merchant-story';
import { MerchantStoryLibrary } from '../models/merchant-story-library';
import { StoryDraft } from '../models/story-draft';
import type { MerchantStoriesMockDatabase } from './merchant-stories-mock-database';
import { MerchantStoriesRepository } from './merchant-stories.repository';

@Injectable()
export class MerchantStoriesMockRepository implements MerchantStoriesRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed stays out of the initial bundle.
  private readonly database$ = from(import('./merchant-stories-mock-database')).pipe(
    map((module) => new module.MerchantStoriesMockDatabase(this.clock)),
    shareReplay(1),
  );

  getLibrary(): Observable<MerchantStoryLibrary> {
    return this.run((database) => database.readLibrary());
  }

  addStory(draft: StoryDraft): Observable<MerchantStory> {
    return this.run((database) => database.add(draft));
  }

  updateStory(id: string, draft: StoryDraft): Observable<MerchantStory> {
    return this.run((database) => database.update(id, draft));
  }

  deleteStory(id: string): Observable<void> {
    return this.run((database) => database.remove(id));
  }

  private run<T>(work: (database: MerchantStoriesMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
