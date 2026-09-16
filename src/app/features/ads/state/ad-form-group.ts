import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { AdAdvertiserType } from '../models/ad-advertiser-type';
import { AdContentType } from '../models/ad-content-type';
import { AdSavedStatus } from '../models/ad-draft';
import { AdPlacement } from '../models/ad-placement';
import { AdPosition } from '../models/ad-position';
import { AdPriority } from '../models/ad-priority';
import { adPeriodValidator, adPlaceValidator } from './ad-form-validators';

/** The statuses "حالة الإعلان الأولية" lists; a draft comes from "حفظ كمسودة" instead. */
export type AdFormStatus = Exclude<AdSavedStatus, 'draft'>;

const HAS_TEXT = /\S/;
const TOP_PRIORITY: AdPriority = 5;

export function createAdFormGroup(formBuilder: FormBuilder) {
  const builder = formBuilder.nonNullable;
  return builder.group(
    {
      title: builder.control('', [Validators.required, Validators.pattern(HAS_TEXT)]),
      advertiserType: builder.control<AdAdvertiserType>('place'),
      placeId: builder.control(''),
      contentType: builder.control<AdContentType>('image'),
      text: builder.control(''),
      placement: builder.control<AdPlacement>('home'),
      position: builder.control<AdPosition>('topBanner'),
      startsOn: new FormControl<string | null>(null, Validators.required),
      endsOn: new FormControl<string | null>(null),
      isOngoing: builder.control(false),
      priority: builder.control<AdPriority>(TOP_PRIORITY),
      status: builder.control<AdFormStatus>('active'),
    },
    { validators: [adPlaceValidator, adPeriodValidator] },
  );
}

export type AdFormGroup = ReturnType<typeof createAdFormGroup>;
export type AdFormValue = ReturnType<AdFormGroup['getRawValue']>;
