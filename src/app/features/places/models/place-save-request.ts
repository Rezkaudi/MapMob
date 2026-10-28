import { MediaFile } from '../../../shared/ui/media-picker/media-file';
import { PlaceFormValue } from '../state/place-form-group';
import { EditedPlaceProduct } from './edited-place-product';
import { PlaceOwner } from './place-owner';
import { PlacePackage } from './place-package';
import { WorkingDay } from './working-day';

/** Everything the place form saves: its fields and the lists it edits beside them. */
export interface PlaceSaveRequest {
  readonly value: PlaceFormValue;
  readonly week: readonly WorkingDay[];
  readonly images: readonly MediaFile[];
  readonly videos: readonly MediaFile[];
  readonly products: readonly EditedPlaceProduct[];
  /** The package the place had when the form opened; `null` for a new place. */
  readonly previousPackage: PlacePackage | null;
  /** The merchant login the place had when the form opened; `null` for a new place. */
  readonly previousOwner: PlaceOwner | null;
}
