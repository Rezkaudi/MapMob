import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { ChoiceOption } from '../../../../shared/ui/choice-chips/choice-option';
import { AD_ADVERTISER_TYPE_LABEL, AdAdvertiserType } from '../../models/ad-advertiser-type';
import { AD_CONTENT_TYPE_LABEL, AdContentType } from '../../models/ad-content-type';
import { AD_PLACEMENT_LABEL, AdPlacement } from '../../models/ad-placement';

/** RTL puts the first chip on the right, as the design orders them. */
const CONTENT_TYPE_ORDER: readonly AdContentType[] = ['image', 'video'];
const ADVERTISER_TYPE_ORDER: readonly AdAdvertiserType[] = ['admin', 'place'];

export const AD_CONTENT_TYPE_CHOICES: readonly ChoiceOption[] = CONTENT_TYPE_ORDER.map((type) => ({
  value: type,
  label: AD_CONTENT_TYPE_LABEL[type],
}));

export const AD_ADVERTISER_TYPE_CHOICES: readonly ChoiceOption[] = ADVERTISER_TYPE_ORDER.map(
  (type) => ({ value: type, label: AD_ADVERTISER_TYPE_LABEL[type] }),
);

export const AD_PLACEMENT_OPTIONS: readonly SelectOption[] = (
  Object.keys(AD_PLACEMENT_LABEL) as AdPlacement[]
).map((placement) => ({ value: placement, label: AD_PLACEMENT_LABEL[placement] }));
