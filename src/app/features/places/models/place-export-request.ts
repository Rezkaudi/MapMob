import { PlaceQuery } from './place-query';

export interface PlaceExportRequest {
  readonly query: PlaceQuery;
  /** The ticked rows. Empty means every place the filters match. */
  readonly ids: readonly string[];
}
