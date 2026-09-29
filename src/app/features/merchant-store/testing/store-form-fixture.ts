import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { findStoreFieldErrors } from '../state/store-field-errors';
import { createStoreProfileFormGroup } from '../state/store-profile-form-group';
import { fillStoreProfileForm } from '../state/store-profile-form-mapping';
import { buildStoreProfile } from './store-profile-fixture';

/** The page's form, filled with the fixture pharmacy. */
export function buildFilledStoreForm() {
  const form = createStoreProfileFormGroup(TestBed.inject(FormBuilder));
  fillStoreProfileForm(form, buildStoreProfile());
  return form;
}

export const NO_FIELD_ERRORS = findStoreFieldErrors(createStoreProfileFormGroup(new FormBuilder()));
