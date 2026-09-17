import { CurrencySettings } from '../models/currency-settings';
import { LanguageSettings } from '../models/language-settings';
import { MapSettings } from '../models/map-settings';
import { PlatformGeneralDraft } from '../models/platform-general-draft';
import { PlatformGeneralSettings } from '../models/platform-general-settings';
import { PlatformSettings } from '../models/platform-settings';

export class PlatformMockRecords {
  constructor(private platform: PlatformSettings) {}

  settings(): PlatformSettings {
    return this.platform;
  }

  updateGeneral({ logo, ...fields }: PlatformGeneralDraft): PlatformGeneralSettings {
    const logoFileName = logo?.name ?? this.platform.general.logoFileName;
    return this.saveGroup('general', { ...fields, logoFileName });
  }

  updateMap(map: MapSettings): MapSettings {
    return this.saveGroup('map', map);
  }

  updateLanguage(language: LanguageSettings): LanguageSettings {
    return this.saveGroup('language', language);
  }

  updateCurrency(currency: CurrencySettings): CurrencySettings {
    return this.saveGroup('currency', currency);
  }

  private saveGroup<K extends keyof PlatformSettings>(
    group: K,
    value: PlatformSettings[K],
  ): PlatformSettings[K] {
    this.platform = { ...this.platform, [group]: value };
    return value;
  }
}
