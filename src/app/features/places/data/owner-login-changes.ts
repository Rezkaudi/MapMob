import { PlaceOwner } from '../models/place-owner';
import { PlaceFormValue } from '../state/place-form-group';

export type OwnerLoginField = 'ownerEmail' | 'ownerPhone' | 'ownerPassword';

/** The merchant login fields an edit changes; an empty password keeps the saved one. */
export function findOwnerLoginChanges(
  value: PlaceFormValue,
  previousOwner: PlaceOwner | null,
): OwnerLoginField[] {
  const changes: OwnerLoginField[] = [];
  if (value.ownerEmail !== previousOwner?.email) {
    changes.push('ownerEmail');
  }
  if (value.ownerPhone !== previousOwner?.phone) {
    changes.push('ownerPhone');
  }
  if (value.ownerPassword) {
    changes.push('ownerPassword');
  }
  return changes;
}
