import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CurrencySettings } from '../models/currency-settings';
import { LanguageSettings } from '../models/language-settings';
import { MapSettings } from '../models/map-settings';
import { PlatformGeneralDraft } from '../models/platform-general-draft';
import { PlatformGeneralSettings } from '../models/platform-general-settings';
import { PlatformSettings } from '../models/platform-settings';
import { LivePlatformSettings } from './live-platform-settings';
import { toPlatformSettings } from './live-settings-mapping';
import { PlatformSettingsRepository } from './platform-settings.repository';

/** Each save answers only a message, so it answers with what was saved. */
@Injectable()
export class PlatformSettingsHttpRepository implements PlatformSettingsRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly platformUrl = `${inject(API_BASE_URL)}/admin/settings/platform`;

  getSettings(): Observable<PlatformSettings> {
    return this.httpClient
      .get<LivePlatformSettings>(this.platformUrl)
      .pipe(map(toPlatformSettings));
  }

  // Multipart for the logo, and PHP reads that body only on POST.
  updateGeneral({ logo, ...fields }: PlatformGeneralDraft): Observable<PlatformGeneralSettings> {
    const body = new FormData();
    body.set('_method', 'PUT');
    Object.entries(fields).forEach(([name, value]) => body.set(name, value));
    if (logo) {
      body.set('logo', logo);
    }
    return this.httpClient.post(`${this.platformUrl}/general`, body).pipe(
      switchMap(() => this.getSettings()),
      map((settings) => settings.general),
    );
  }

  updateMap(mapSettings: MapSettings): Observable<MapSettings> {
    return this.save('map', mapSettings);
  }

  updateLanguage(language: LanguageSettings): Observable<LanguageSettings> {
    return this.save('language', language);
  }

  updateCurrency(currency: CurrencySettings): Observable<CurrencySettings> {
    return this.save('currency', currency);
  }

  private save<T extends object>(group: string, values: T): Observable<T> {
    return this.httpClient.put(`${this.platformUrl}/${group}`, values).pipe(map(() => values));
  }
}
