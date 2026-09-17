import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { PlatformSettingsHttpRepository } from './platform-settings-http.repository';

const BASE_URL = 'https://api.test';
const PLATFORM_URL = `${BASE_URL}/settings/platform`;

describe('PlatformSettingsHttpRepository', () => {
  let repository: PlatformSettingsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlatformSettingsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(PlatformSettingsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the platform settings', () => {
    repository.getSettings().subscribe();

    http.expectOne({ method: 'GET', url: PLATFORM_URL }).flush({});
  });

  it('sends the basic information as a form, with the picked logo', () => {
    const logo = new File(['<svg/>'], 'logo.svg', { type: 'image/svg+xml' });
    repository
      .updateGeneral({ appName: 'MapMob', supportEmail: 'a@b.co', supportPhone: '+963', logo })
      .subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${PLATFORM_URL}/general` });
    const body = request.request.body as FormData;
    expect(body.get('appName')).toBe('MapMob');
    expect(body.get('supportEmail')).toBe('a@b.co');
    expect(body.get('supportPhone')).toBe('+963');
    expect((body.get('logo') as File).name).toBe('logo.svg');
    request.flush({});
  });

  it('leaves the logo out when none was picked', () => {
    repository
      .updateGeneral({
        appName: 'MapMob',
        supportEmail: 'a@b.co',
        supportPhone: '+963',
        logo: null,
      })
      .subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${PLATFORM_URL}/general` });
    expect((request.request.body as FormData).has('logo')).toBe(false);
    request.flush({});
  });

  it('saves the map, language and currency groups at their own addresses', () => {
    const map = { distanceUnit: 'kilometer', searchRadiusKm: 15 } as const;
    const language = { defaultLanguage: 'ar', detectsDeviceLanguage: true } as const;
    const currency = { currency: 'SYP', currencySymbol: 'ل.س', decimalPlaces: 0 } as const;
    repository.updateMap(map).subscribe();
    repository.updateLanguage(language).subscribe();
    repository.updateCurrency(currency).subscribe();

    expect(http.expectOne(`${PLATFORM_URL}/map`).request.body).toEqual(map);
    expect(http.expectOne(`${PLATFORM_URL}/language`).request.body).toEqual(language);
    expect(http.expectOne(`${PLATFORM_URL}/currency`).request.body).toEqual(currency);
  });
});
