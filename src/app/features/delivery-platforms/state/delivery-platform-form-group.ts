import { FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { webAddress } from '../../../shared/forms/contact-validators';
import { hasText } from '../../../shared/forms/has-text';
import { DeliveryPlatformDraft } from '../models/delivery-platform-draft';
import { DeliveryPlatformStatus } from '../models/delivery-platform-status';

/** Matches delivery_platforms.name and latin_name. */
const NAME_MAX_LENGTH = 60;
const WEBSITE_MAX_LENGTH = 255;
const LATIN_NAME_PATTERN = /^[A-Za-z0-9][A-Za-z0-9 .&'-]*$/;
const SORT_ORDER_PATTERN = /^[1-9]\d{0,3}$/;

export type DeliveryPlatformFormGroup = FormGroup<{
  name: FormControl<string>;
  latinName: FormControl<string>;
  websiteUrl: FormControl<string>;
  status: FormControl<DeliveryPlatformStatus>;
  /** Text, so an empty box means "use the suggested position". */
  sortOrder: FormControl<string>;
}>;

export type DeliveryPlatformFields = Omit<DeliveryPlatformDraft, 'logoFile' | 'logoUrl'>;

function textControl(value: string, maxLength: number, ...extra: ValidatorFn[]) {
  return new FormControl(value, {
    nonNullable: true,
    validators: [Validators.required, hasText, Validators.maxLength(maxLength), ...extra],
  });
}

/** `null` opens the add dialog: every field empty and the platform switched on. */
export function createDeliveryPlatformFormGroup(
  draft: DeliveryPlatformDraft | null,
): DeliveryPlatformFormGroup {
  return new FormGroup({
    name: textControl(draft?.name ?? '', NAME_MAX_LENGTH),
    latinName: textControl(
      draft?.latinName ?? '',
      NAME_MAX_LENGTH,
      Validators.pattern(LATIN_NAME_PATTERN),
    ),
    websiteUrl: textControl(draft?.websiteUrl ?? '', WEBSITE_MAX_LENGTH, webAddress),
    status: new FormControl<DeliveryPlatformStatus>(draft?.status ?? 'active', {
      nonNullable: true,
    }),
    sortOrder: new FormControl(draft ? String(draft.sortOrder) : '', {
      nonNullable: true,
      validators: [Validators.pattern(SORT_ORDER_PATTERN)],
    }),
  });
}

export function readDeliveryPlatformFields(
  form: DeliveryPlatformFormGroup,
  suggestedSortOrder: number,
): DeliveryPlatformFields {
  const value = form.getRawValue();
  const sortOrder = value.sortOrder.trim();
  return {
    name: value.name.trim(),
    latinName: value.latinName.trim(),
    websiteUrl: value.websiteUrl.trim(),
    status: value.status,
    sortOrder: sortOrder ? Number(sortOrder) : suggestedSortOrder,
  };
}
