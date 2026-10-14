import { PlaceProduct } from './place-product';

/** A product row of the form, with the picture picked for upload, if any. */
export interface EditedPlaceProduct extends PlaceProduct {
  readonly imageFile: File | null;
}
