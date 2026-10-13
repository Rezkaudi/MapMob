import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceExportRequest } from '../models/place-export-request';
import { PlaceQuery } from '../models/place-query';
import { PlaceStatusCounts } from '../models/place-status-counts';

export abstract class PlaceRepository {
  abstract getPlaces(query: PlaceQuery): Observable<PagedResult<Place>>;
  abstract getStatusCounts(): Observable<PlaceStatusCounts>;
  abstract getPlace(id: string): Observable<PlaceDetail>;
  /** One id for a row menu, many for the bulk bar. */
  abstract setPlacesStatus(ids: readonly string[], status: ActivationStatus): Observable<void>;
  abstract deletePlaces(ids: readonly string[]): Observable<void>;
  abstract exportPlaces(request: PlaceExportRequest): Observable<Blob>;
  /** The choices of the category filter; the value is what `PlaceQuery.category` sends. */
  abstract getCategoryOptions(): Observable<readonly SelectOption[]>;
}
