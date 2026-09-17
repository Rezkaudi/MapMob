import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { joinSendAt } from './send-moment';

/** Returns the wall-clock time now, `yyyy-mm-ddThh:mm`. */
export type WallClockNow = () => string;

export const recipientsValidator: ValidatorFn = (
  group: AbstractControl,
): ValidationErrors | null => {
  const { recipientMode, recipientIds, governorateId } = group.value;
  if (recipientMode === 'selected' && recipientIds.length === 0) {
    return { recipientsRequired: true };
  }
  if (recipientMode === 'location' && !governorateId) {
    return { governorateRequired: true };
  }
  return null;
};

export function sendTimeValidator(now: WallClockNow): ValidatorFn {
  return (group: AbstractControl): ValidationErrors | null => {
    const { timing, sendDay, sendTime } = group.value;
    if (timing !== 'later') {
      return null;
    }
    if (!sendDay || !sendTime) {
      return { sendTimeRequired: true };
    }
    return joinSendAt({ day: sendDay, time: sendTime }) > now() ? null : { sendTimePassed: true };
  };
}
