import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceQuery } from '../models/place-query';
import { PlaceStatusCounts } from '../models/place-status-counts';

export abstract class PlaceRepository {
  abstract getPlaces(query: PlaceQuery): Observable<PagedResult<Place>>;
  abstract getStatusCounts(): Observable<PlaceStatusCounts>;
  abstract getPlace(id: string): Observable<PlaceDetail>;
}
