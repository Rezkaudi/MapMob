import { PlaceFormValue } from '../state/place-form-group';

export type OwnerLoginField = 'ownerPassword';

/** The merchant login fields an edit sends; email and phone are fixed, and an empty password keeps the saved one. */
export function findOwnerLoginChanges(value: PlaceFormValue): OwnerLoginField[] {
  return value.ownerPassword ? ['ownerPassword'] : [];
}
