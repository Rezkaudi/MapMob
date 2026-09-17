import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UploadedImage } from '../../../shared/ui/image-upload-field/uploaded-image';
import { AboutPage } from '../models/about-page';
import { AboutPageDraft } from '../models/about-page-draft';
import { ContentPageStatus } from '../models/content-page-status';
import { contactEmail, phoneNumber } from '../../../shared/forms/contact-validators';
import { hasText } from '../../../shared/forms/has-text';

function requiredText(...extraValidators: ReturnType<typeof Validators.pattern>[]) {
  return new FormControl('', {
    nonNullable: true,
    validators: [Validators.required, hasText, ...extraValidators],
  });
}

export function createAboutPageFormGroup() {
  return new FormGroup({
    title: requiredText(),
    summary: requiredText(),
    phone: requiredText(phoneNumber),
    email: requiredText(contactEmail),
    address: requiredText(),
  });
}

export type AboutPageFormGroup = ReturnType<typeof createAboutPageFormGroup>;
export type AboutPageFormValue = ReturnType<AboutPageFormGroup['getRawValue']>;

export interface AboutPageDraftExtras {
  /** The banner picked or kept in the form. */
  readonly banner: UploadedImage | null;
  readonly hadSavedBanner: boolean;
  readonly status: ContentPageStatus;
}

export function toAboutPageFormValue({ bannerUrl, ...fields }: AboutPage): AboutPageFormValue {
  return fields;
}

export function toAboutPageDraft(
  value: AboutPageFormValue,
  extras: AboutPageDraftExtras,
): AboutPageDraft {
  return {
    title: value.title.trim(),
    summary: value.summary,
    phone: value.phone.trim(),
    email: value.email.trim(),
    address: value.address.trim(),
    banner: extras.banner?.file ?? null,
    isBannerRemoved: extras.hadSavedBanner && extras.banner === null,
    status: extras.status,
  };
}
