import { HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { SETTINGS_URL, setUpSettingsRepository } from '../testing/settings-http-testing';
import { PlatformSettingsHttpRepository } from './platform-settings-http.repository';

const PLATFORM_URL = `${SETTINGS_URL}/platform`;
const LIVE_SETTINGS = {
  general: {
    appName: 'MapMob',
    logoUrl: 'https://api.test/storage/platform/logo.png',
    supportEmail: 'support@mapmob.com',
    supportPhone: '0931234567',
  },
  map: { distanceUnit: 'kilometer', searchRadiusKm: 10 },
  language: { defaultLanguage: 'ar', detectsDeviceLanguage: true },
  currency: { currency: 'SYP', currencySymbol: 'ل.س', decimalPlaces: 0 },
};
const SAVED = { message: 'updated successfully' };

describe('PlatformSettingsHttpRepository', () => {
  let repository: PlatformSettingsHttpRepository;
  let http: HttpTestingController;

  beforeEach(
    () => ({ repository, http } = setUpSettingsRepository(PlatformSettingsHttpRepository)),
  );

  afterEach(() => http.verify());

  it('reads the four groups and names the logo by its file', async () => {
    const response = firstValueFrom(repository.getSettings());

    http.expectOne(PLATFORM_URL).flush(LIVE_SETTINGS);

    const settings = await response;
    expect(settings.general).toEqual({
      appName: 'MapMob',
      logoFileName: 'logo.png',
      supportEmail: 'support@mapmob.com',
      supportPhone: '0931234567',
    });
    expect(settings.currency.currency).toBe('SYP');
  });

  it('saves the general group as multipart, then reads it back for the logo name', async () => {
    const logo = new File(['x'], 'new-logo.png', { type: 'image/png' });
    const response = firstValueFrom(
      repository.updateGeneral({
        appName: 'MapMob',
        supportEmail: 'support@mapmob.com',
        supportPhone: '0931234567',
        logo,
      }),
    );

    const request = http.expectOne(`${PLATFORM_URL}/general`);
    expect(request.request.method).toBe('POST');
    const form = request.request.body as FormData;
    expect([form.get('_method'), form.get('appName')]).toEqual(['PUT', 'MapMob']);
    expect(form.get('logo')).toBeInstanceOf(File);
    request.flush(SAVED);
    http.expectOne(PLATFORM_URL).flush(LIVE_SETTINGS);

    expect((await response).logoFileName).toBe('logo.png');
  });

  it('saves the map, language and currency groups and answers with what was saved', async () => {
    const map = { distanceUnit: 'mile', searchRadiusKm: 20 } as const;
    const savedMap = firstValueFrom(repository.updateMap(map));
    const mapRequest = http.expectOne(`${PLATFORM_URL}/map`);
    expect([mapRequest.request.method, mapRequest.request.body]).toEqual(['PUT', map]);
    mapRequest.flush(SAVED);
    expect(await savedMap).toEqual(map);

    const language = { defaultLanguage: 'en', detectsDeviceLanguage: false } as const;
    const savedLanguage = firstValueFrom(repository.updateLanguage(language));
    http.expectOne(`${PLATFORM_URL}/language`).flush(SAVED);
    expect(await savedLanguage).toEqual(language);

    const currency = { currency: 'USD', currencySymbol: '$', decimalPlaces: 2 } as const;
    const savedCurrency = firstValueFrom(repository.updateCurrency(currency));
    http.expectOne(`${PLATFORM_URL}/currency`).flush(SAVED);
    expect(await savedCurrency).toEqual(currency);
  });
});
