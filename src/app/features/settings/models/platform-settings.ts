import { CurrencySettings } from './currency-settings';
import { LanguageSettings } from './language-settings';
import { MapSettings } from './map-settings';
import { PlatformGeneralSettings } from './platform-general-settings';

/** One group per card on the platform tab; each card saves its group alone. */
export interface PlatformSettings {
  readonly general: PlatformGeneralSettings;
  readonly map: MapSettings;
  readonly language: LanguageSettings;
  readonly currency: CurrencySettings;
}

export type PlatformSettingsForm = keyof PlatformSettings;
