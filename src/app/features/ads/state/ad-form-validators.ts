import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/** A store's ad needs its store. */
export const adPlaceValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const isStoreAd = group.get('advertiserType')?.value === 'place';
  return isStoreAd && !group.get('placeId')?.value ? { placeRequired: true } : null;
};

/** Needs a last day on or after the first, unless "بدون تاريخ انتهاء" is ticked. */
export const adPeriodValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  if (group.get('isOngoing')?.value) {
    return null;
  }
  const startsOn: string | null = group.get('startsOn')?.value ?? null;
  const endsOn: string | null = group.get('endsOn')?.value ?? null;
  if (!endsOn) {
    return { endDayRequired: true };
  }
  return startsOn && endsOn < startsOn ? { periodOrder: true } : null;
};
