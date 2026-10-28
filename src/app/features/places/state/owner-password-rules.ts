import { AbstractControl, ValidatorFn, Validators } from '@angular/forms';

export const OWNER_PASSWORD_MIN_LENGTH = 8;

const LENGTH_RULE = Validators.minLength(OWNER_PASSWORD_MIN_LENGTH);

export const NEW_OWNER_PASSWORD_RULES: ValidatorFn[] = [Validators.required, LENGTH_RULE];

/** An edit keeps the saved password when the field stays empty. */
const KEPT_OWNER_PASSWORD_RULES: ValidatorFn[] = [LENGTH_RULE];

export function applyOwnerPasswordRules(control: AbstractControl, isEditing: boolean): void {
  control.setValidators(isEditing ? KEPT_OWNER_PASSWORD_RULES : NEW_OWNER_PASSWORD_RULES);
  control.updateValueAndValidity({ emitEvent: false });
}
