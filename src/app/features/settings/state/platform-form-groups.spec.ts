import { buildPlatformSettings } from '../testing/settings-fixture';
import {
  MAX_SEARCH_RADIUS_KM,
  createCurrencySettingsFormGroup,
  createMapSettingsFormGroup,
  createPlatformGeneralFormGroup,
} from './platform-form-groups';

describe('platform settings forms', () => {
  it('needs an app name, a valid support email and a phone number', () => {
    const form = createPlatformGeneralFormGroup();

    form.setValue({ appName: ' ', supportEmail: 'support@mapmob', supportPhone: 'abc' });
    expect(form.controls.appName.valid).toBe(false);
    expect(form.controls.supportEmail.valid).toBe(false);
    expect(form.controls.supportPhone.valid).toBe(false);

    const { appName, supportEmail, supportPhone } = buildPlatformSettings().general;
    form.setValue({ appName, supportEmail, supportPhone });
    expect(form.valid).toBe(true);
  });

  it('keeps the search radius a whole number of kilometres between 1 and the maximum', () => {
    const form = createMapSettingsFormGroup();

    for (const radius of [0, 2.5, MAX_SEARCH_RADIUS_KM + 1]) {
      form.setValue({ distanceUnit: 'kilometer', searchRadiusKm: radius });
      expect(form.valid).toBe(false);
    }
    form.setValue({ distanceUnit: 'kilometer', searchRadiusKm: MAX_SEARCH_RADIUS_KM });
    expect(form.valid).toBe(true);
  });

  it('needs a currency symbol', () => {
    const form = createCurrencySettingsFormGroup();

    form.setValue({ currency: 'SYP', currencySymbol: '  ', decimalPlaces: 0 });

    expect(form.valid).toBe(false);
  });
});
