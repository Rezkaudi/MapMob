import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { CurrencySettings } from '../models/currency-settings';
import { LanguageSettings } from '../models/language-settings';
import { MapSettings } from '../models/map-settings';
import { PlatformGeneralDraft } from '../models/platform-general-draft';
import { PlatformGeneralSettings } from '../models/platform-general-settings';
import { PlatformSettings } from '../models/platform-settings';
import { PlatformSettingsRepository } from './platform-settings.repository';
import { SettingsMockDatabaseLoader } from './settings-mock-database-loader';

@Injectable()
export class PlatformSettingsMockRepository implements PlatformSettingsRepository {
  private readonly loader = inject(SettingsMockDatabaseLoader);

  getSettings(): Observable<PlatformSettings> {
    return this.loader.request((database) => database.platform.settings());
  }

  updateGeneral(draft: PlatformGeneralDraft): Observable<PlatformGeneralSettings> {
    return this.loader.request((database) => database.platform.updateGeneral(draft));
  }

  updateMap(map: MapSettings): Observable<MapSettings> {
    return this.loader.request((database) => database.platform.updateMap(map));
  }

  updateLanguage(language: LanguageSettings): Observable<LanguageSettings> {
    return this.loader.request((database) => database.platform.updateLanguage(language));
  }

  updateCurrency(currency: CurrencySettings): Observable<CurrencySettings> {
    return this.loader.request((database) => database.platform.updateCurrency(currency));
  }
}
