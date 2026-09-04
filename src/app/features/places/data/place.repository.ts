import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { Place } from '../models/place';
import { PlaceQuery } from '../models/place-query';

export abstract class PlaceRepository {
  abstract getPlaces(query: PlaceQuery): Observable<PagedResult<Place>>;
}
