import { AppLanguage } from '../models/app-language';
import { CurrencyCode } from '../models/currency-code';
import { DecimalPlaces } from '../models/decimal-places';
import { DistanceUnit } from '../models/distance-unit';
import { SettingsChoice } from '../models/settings-choice';

export const DISTANCE_UNIT_CHOICES: readonly SettingsChoice<DistanceUnit>[] = [
  { value: 'kilometer', label: 'كيلو متر (كم / km) - افتراضي' },
  { value: 'mile', label: 'ميل (mi)' },
];

/** The unit written after the search radius, e.g. "15 كم". */
export const DISTANCE_UNIT_SHORT_LABELS: Record<DistanceUnit, string> = {
  kilometer: 'كم',
  mile: 'ميل',
};

export const LANGUAGE_CHOICES: readonly SettingsChoice<AppLanguage>[] = [
  { value: 'ar', label: 'العربية (Arabic)' },
  { value: 'en', label: 'الإنجليزية (English)' },
];

export const CURRENCY_CHOICES: readonly SettingsChoice<CurrencyCode>[] = [
  { value: 'SYP', label: 'الليرة السورية (ل.س / SYP)' },
  { value: 'USD', label: 'الدولار الأمريكي ($ / USD)' },
];

export const DECIMAL_PLACE_CHOICES: readonly SettingsChoice<DecimalPlaces>[] = [
  { value: 0, label: '0 مثال (1500)' },
  { value: 1, label: '1 مثال (1500.0)' },
  { value: 2, label: '2 مثال (1500.00)' },
];
