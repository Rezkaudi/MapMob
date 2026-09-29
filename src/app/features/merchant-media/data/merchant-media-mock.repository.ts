import { Injectable, inject } from '@angular/core';
import { Observable, from, map, shareReplay, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { CLOCK } from '../../../core/config/clock';
import { MediaDraft } from '../models/media-draft';
import { MerchantMediaItem } from '../models/merchant-media-item';
import { MerchantMediaLibrary } from '../models/merchant-media-library';
import type { MerchantMediaMockDatabase } from './merchant-media-mock-database';
import { MerchantMediaRepository } from './merchant-media.repository';

@Injectable()
export class MerchantMediaMockRepository implements MerchantMediaRepository {
  private readonly clock = inject(CLOCK);
  // Loaded on first use, so the seed stays out of the initial bundle.
  private readonly database$ = from(import('./merchant-media-mock-database')).pipe(
    map((module) => new module.MerchantMediaMockDatabase(this.clock)),
    shareReplay(1),
  );

  getLibrary(): Observable<MerchantMediaLibrary> {
    return this.run((database) => database.readLibrary());
  }

  addMedia(draft: MediaDraft): Observable<MerchantMediaItem> {
    return this.run((database) => database.add(draft));
  }

  replaceMedia(id: string, file: File): Observable<MerchantMediaItem> {
    return this.run((database) => database.replace(id, file));
  }

  deleteMedia(id: string): Observable<void> {
    return this.run((database) => database.remove(id));
  }

  private run<T>(work: (database: MerchantMediaMockDatabase) => T): Observable<T> {
    return this.database$.pipe(switchMap((database) => mockRequest(() => work(database))));
  }
}
