import { FormControl, FormGroup, Validators } from '@angular/forms';
import { contactEmail } from '../../../shared/forms/contact-validators';
import { hasText } from '../../../shared/forms/has-text';
import { AccountProfileDraft } from '../models/account-profile-draft';

export function createAccountProfileFormGroup() {
  return new FormGroup({
    fullName: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, hasText],
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, contactEmail],
    }),
  });
}

export function toAccountProfileDraft(value: AccountProfileDraft): AccountProfileDraft {
  return { fullName: value.fullName.trim(), email: value.email.trim() };
}
