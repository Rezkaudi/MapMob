import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { webAddress } from '../../../shared/forms/contact-validators';
import { hasText } from '../../../shared/forms/has-text';
import { ProviderJoinPageDraft } from '../models/provider-join-page-draft';

function requiredText(...extraValidators: ValidatorFn[]) {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, hasText, ...extraValidators],
  });
}

export function createProviderJoinPageFormGroup() {
  return new FormGroup({
    title: requiredText(),
    registrationFormUrl: requiredText(webAddress),
  });
}

export type ProviderJoinPageFormGroup = ReturnType<typeof createProviderJoinPageFormGroup>;
export type ProviderJoinPageFormValue = ReturnType<ProviderJoinPageFormGroup['getRawValue']>;

/** The design gives this page no "حفظ كمسودة", so every save publishes it. */
export function toProviderJoinPageDraft(value: ProviderJoinPageFormValue): ProviderJoinPageDraft {
  return {
    title: value.title.trim(),
    registrationFormUrl: value.registrationFormUrl.trim(),
    status: 'published',
  };
}
