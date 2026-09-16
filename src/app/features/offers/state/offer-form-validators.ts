import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** Needs the last day of the offer on or after its first day. */
export const offerPeriodValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const startsOn: string | null = group.get('startsOn')?.value ?? null;
  const endsOn: string | null = group.get('endsOn')?.value ?? null;
  return startsOn && endsOn && endsOn < startsOn ? { periodOrder: true } : null;
};

/** An offer on picked items only needs at least one item. */
export const selectedItemsValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const isPickingItems = group.get('scope')?.value === 'selectedItems';
  const itemIds: readonly string[] = group.get('itemIds')?.value ?? [];
  return isPickingItems && itemIds.length === 0 ? { itemsRequired: true } : null;
};
