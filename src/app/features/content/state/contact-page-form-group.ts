import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { ContactPageDraft } from '../models/contact-page-draft';
import { ContentPageStatus } from '../models/content-page-status';
import { contactEmail, phoneNumber, webAddress } from '../../../shared/forms/contact-validators';
import { hasText } from '../../../shared/forms/has-text';

function requiredText(...extraValidators: ValidatorFn[]) {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, hasText, ...extraValidators],
  });
}

export function createContactPageFormGroup() {
  return new FormGroup({
    title: requiredText(),
    introduction: requiredText(),
    supportPhone: requiredText(phoneNumber),
    supportEmail: requiredText(contactEmail),
    facebookUrl: requiredText(webAddress),
    instagramUrl: requiredText(webAddress),
    telegramUrl: requiredText(webAddress),
    whatsappUrl: requiredText(webAddress),
  });
}

export type ContactPageFormGroup = ReturnType<typeof createContactPageFormGroup>;
export type ContactPageFormValue = ReturnType<ContactPageFormGroup['getRawValue']>;

export function toContactPageDraft(
  value: ContactPageFormValue,
  status: ContentPageStatus,
): ContactPageDraft {
  const trimmed = Object.fromEntries(
    Object.entries(value).map(([field, text]) => [field, text.trim()]),
  ) as ContactPageFormValue;
  return { ...trimmed, status };
}
