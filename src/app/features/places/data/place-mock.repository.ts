import { Injectable, inject } from '@angular/core';
import { Observable, from, switchMap } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceExportRequest } from '../models/place-export-request';
import { PlaceQuery } from '../models/place-query';
import { PlaceStatusCounts } from '../models/place-status-counts';
import { PlaceMockDatabase } from './place-mock-database';
import { countPlacesByStatus, filterPlaces, queryPlaces } from './place-mock-query';
import { PlaceRepository } from './place.repository';
import { buildPlacesCsvFile } from './places-csv';

/** The sample detail page is loaded on first use, so its copy stays out of the initial bundle. */
const loadDetailBuilder = () => from(import('./place-mock-detail'));

@Injectable()
export class PlaceMockRepository implements PlaceRepository {
  private readonly database = inject(PlaceMockDatabase);

  getPlaces(query: PlaceQuery): Observable<PagedResult<Place>> {
    return mockRequest(() => queryPlaces(this.database.list(), query));
  }

  getPlace(id: string): Observable<PlaceDetail> {
    return loadDetailBuilder().pipe(
      switchMap(({ buildMockPlaceDetail }) =>
        mockRequest(() => buildMockPlaceDetail(this.database.find(id))),
      ),
    );
  }

  getStatusCounts(): Observable<PlaceStatusCounts> {
    return mockRequest(() => countPlacesByStatus(this.database.list()));
  }

  setPlacesStatus(ids: readonly string[], status: ActivationStatus): Observable<void> {
    return mockRequest(() => this.database.setStatus(ids, status));
  }

  deletePlaces(ids: readonly string[]): Observable<void> {
    return mockRequest(() => this.database.remove(ids));
  }

  exportPlaces(request: PlaceExportRequest): Observable<Blob> {
    return mockRequest(() => buildPlacesCsvFile(this.exportedPlaces(request)));
  }

  private exportedPlaces({ query, ids }: PlaceExportRequest): readonly Place[] {
    const matching = filterPlaces(this.database.list(), query);
    if (ids.length === 0) {
      return matching;
    }
    const ticked = new Set(ids);
    return matching.filter((place) => ticked.has(place.id));
  }
}
