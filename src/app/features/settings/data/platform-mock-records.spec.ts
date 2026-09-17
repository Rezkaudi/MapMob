import { buildPlatformSettings } from '../testing/settings-fixture';
import { buildSettingsMockSeed } from '../testing/settings-mock-seed-fixture';
import { PlatformMockRecords } from './platform-mock-records';

function createRecords() {
  const seed = buildSettingsMockSeed();
  return new PlatformMockRecords(seed.platform);
}

describe('PlatformMockRecords', () => {
  it('returns the platform settings', () => {
    expect(createRecords().settings()).toEqual(buildPlatformSettings());
  });

  it('saves the basic information and keeps the logo when none is picked', () => {
    const records = createRecords();

    const general = records.updateGeneral({
      appName: 'MapMob Pro',
      supportEmail: 'help@mapmob.com',
      supportPhone: '+963 933 000 111',
      logo: null,
    });

    expect(general).toEqual({
      appName: 'MapMob Pro',
      logoFileName: 'MapMob_logo.svg',
      supportEmail: 'help@mapmob.com',
      supportPhone: '+963 933 000 111',
    });
    expect(records.settings().general).toEqual(general);
  });

  it('takes the name of a newly picked logo', () => {
    const records = createRecords();
    const logo = new File(['<svg/>'], 'new-logo.svg', { type: 'image/svg+xml' });

    const general = records.updateGeneral({ ...buildPlatformSettings().general, logo });

    expect(general.logoFileName).toBe('new-logo.svg');
  });

  it('saves the map, language and currency groups on their own', () => {
    const records = createRecords();

    records.updateMap({ distanceUnit: 'mile', searchRadiusKm: 25 });
    records.updateLanguage({ defaultLanguage: 'en', detectsDeviceLanguage: false });
    records.updateCurrency({ currency: 'USD', currencySymbol: '$', decimalPlaces: 2 });

    expect(records.settings()).toEqual(
      buildPlatformSettings({
        map: { distanceUnit: 'mile', searchRadiusKm: 25 },
        language: { defaultLanguage: 'en', detectsDeviceLanguage: false },
        currency: { currency: 'USD', currencySymbol: '$', decimalPlaces: 2 },
      }),
    );
  });
});
