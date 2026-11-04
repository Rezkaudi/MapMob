import { FormControl, FormGroup, Validators } from '@angular/forms';
import { LegalPageDraft } from '../models/legal-page-draft';
import { hasText } from '../../../shared/forms/has-text';

export function createLegalPageFormGroup() {
  return new FormGroup({
    title: new FormControl('', { nonNullable: true, validators: [Validators.required, hasText] }),
    body: new FormControl('', { nonNullable: true, validators: [Validators.required, hasText] }),
  });
}

export type LegalPageFormGroup = ReturnType<typeof createLegalPageFormGroup>;
export type LegalPageFormValue = ReturnType<LegalPageFormGroup['getRawValue']>;

export function toLegalPageDraft(value: LegalPageFormValue): LegalPageDraft {
  return { title: value.title.trim(), body: value.body };
}
