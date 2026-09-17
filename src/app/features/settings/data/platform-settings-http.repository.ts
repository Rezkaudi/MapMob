import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CurrencySettings } from '../models/currency-settings';
import { LanguageSettings } from '../models/language-settings';
import { MapSettings } from '../models/map-settings';
import { PlatformGeneralDraft } from '../models/platform-general-draft';
import { PlatformGeneralSettings } from '../models/platform-general-settings';
import { PlatformSettings } from '../models/platform-settings';
import { PlatformSettingsRepository } from './platform-settings.repository';

@Injectable()
export class PlatformSettingsHttpRepository implements PlatformSettingsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly apiBaseUrl = inject(API_BASE_URL);

  private get platformUrl(): string {
    return `${this.apiBaseUrl}/settings/platform`;
  }

  getSettings(): Observable<PlatformSettings> {
    return this.httpClient.get<PlatformSettings>(this.platformUrl);
  }

  updateGeneral({ logo, ...fields }: PlatformGeneralDraft): Observable<PlatformGeneralSettings> {
    const body = new FormData();
    Object.entries(fields).forEach(([name, value]) => body.append(name, value));
    if (logo) {
      body.append('logo', logo);
    }
    return this.httpClient.put<PlatformGeneralSettings>(`${this.platformUrl}/general`, body);
  }

  updateMap(map: MapSettings): Observable<MapSettings> {
    return this.httpClient.put<MapSettings>(`${this.platformUrl}/map`, map);
  }

  updateLanguage(language: LanguageSettings): Observable<LanguageSettings> {
    return this.httpClient.put<LanguageSettings>(`${this.platformUrl}/language`, language);
  }

  updateCurrency(currency: CurrencySettings): Observable<CurrencySettings> {
    return this.httpClient.put<CurrencySettings>(`${this.platformUrl}/currency`, currency);
  }
}
