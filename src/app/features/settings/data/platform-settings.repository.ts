import { Observable } from 'rxjs';
import { CurrencySettings } from '../models/currency-settings';
import { LanguageSettings } from '../models/language-settings';
import { MapSettings } from '../models/map-settings';
import { PlatformGeneralDraft } from '../models/platform-general-draft';
import { PlatformGeneralSettings } from '../models/platform-general-settings';
import { PlatformSettings } from '../models/platform-settings';

export abstract class PlatformSettingsRepository {
  abstract getSettings(): Observable<PlatformSettings>;
  abstract updateGeneral(draft: PlatformGeneralDraft): Observable<PlatformGeneralSettings>;
  abstract updateMap(map: MapSettings): Observable<MapSettings>;
  abstract updateLanguage(language: LanguageSettings): Observable<LanguageSettings>;
  abstract updateCurrency(currency: CurrencySettings): Observable<CurrencySettings>;
}
