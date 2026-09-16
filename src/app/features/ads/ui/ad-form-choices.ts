import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { AdAdvertiserType } from '../models/ad-advertiser-type';
import { AdContentType } from '../models/ad-content-type';
import { AD_PLACEMENT_LABEL, AdPlacement } from '../models/ad-placement';
import { AD_POSITION_LABEL, AdPosition } from '../models/ad-position';
import { AD_PRIORITIES, AD_PRIORITY_LABEL, AdPriority } from '../models/ad-priority';
import { AdFormStatus } from '../state/ad-form-group';

export interface AdOptionCardChoice<TValue> {
  readonly value: TValue;
  readonly title: string;
  readonly description: string;
}

/** RTL puts the first card on the right, as the design does. */
export const ADVERTISER_TYPE_CARDS: readonly AdOptionCardChoice<AdAdvertiserType>[] = [
  { value: 'place', title: 'شركة / متجر', description: 'حملة خاصة بمعلن مسجل' },
  { value: 'admin', title: 'إدارة التطبيق', description: 'إعلان داخلي أو تنبيه منصة' },
];

export const CONTENT_TYPE_CARDS: readonly AdOptionCardChoice<AdContentType>[] = [
  { value: 'image', title: 'صورة ثابتة (Banner)', description: '' },
  { value: 'video', title: 'فيديو ترويجي', description: '' },
];

export const PLACEMENT_OPTIONS: readonly SelectOption[] = (
  Object.keys(AD_PLACEMENT_LABEL) as AdPlacement[]
).map((value) => ({ value, label: AD_PLACEMENT_LABEL[value] }));

export const POSITION_OPTIONS: readonly SelectOption[] = (
  Object.keys(AD_POSITION_LABEL) as AdPosition[]
).map((value) => ({ value, label: AD_POSITION_LABEL[value] }));

export const PRIORITY_OPTIONS: readonly { value: AdPriority; label: string }[] = AD_PRIORITIES.map(
  (value) => ({ value, label: AD_PRIORITY_LABEL[value] }),
);

export const AD_STATUS_OPTIONS: readonly { value: AdFormStatus; label: string }[] = [
  { value: 'active', label: 'نشط (يبدأ العرض فوراً عند التاريخ)' },
  { value: 'paused', label: 'متوقف (لا يظهر حتى تفعيله)' },
];
