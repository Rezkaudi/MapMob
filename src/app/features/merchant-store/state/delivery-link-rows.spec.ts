import { FormBuilder } from '@angular/forms';
import { buildStoreProfile } from '../testing/store-profile-fixture';
import { setDeliveryLinkEnabled } from './delivery-link-form';
import { toDeliveryLinkRows } from './delivery-link-rows';
import { createStoreProfileFormGroup } from './store-profile-form-group';
import { fillStoreProfileForm } from './store-profile-form-mapping';

function buildForm() {
  const profile = buildStoreProfile();
  const form = createStoreProfileFormGroup(new FormBuilder());
  fillStoreProfileForm(form, profile);
  return { profile, links: form.controls.deliveryLinks };
}

describe('toDeliveryLinkRows', () => {
  it('shows each platform with the switch and link being edited', () => {
    const { profile, links } = buildForm();

    expect(toDeliveryLinkRows(profile.deliveryLinks, links)).toEqual([
      {
        index: 0,
        platform: profile.deliveryLinks[0].platform,
        isEnabled: true,
        storeUrl: 'https://beeorder.sy/store/alhayat-pharma',
        canOpen: true,
        error: null,
      },
      {
        index: 1,
        platform: profile.deliveryLinks[1].platform,
        isEnabled: false,
        storeUrl: '',
        canOpen: false,
        error: null,
      },
    ]);
  });

  it('asks for the link once a switched-on platform without one was left', () => {
    const { profile, links } = buildForm();
    setDeliveryLinkEnabled(links.at(1), true);

    expect(toDeliveryLinkRows(profile.deliveryLinks, links)[1].error).toBeNull();

    links.at(1).controls.storeUrl.markAsTouched();
    const row = toDeliveryLinkRows(profile.deliveryLinks, links)[1];

    expect(row.error).toBe('أدخل رابط متجرك على المنصة');
    expect(row.canOpen).toBe(false);
  });

  it('explains a link that is not a full address', () => {
    const { profile, links } = buildForm();
    links.at(0).controls.storeUrl.setValue('beeorder.sy/store');
    links.at(0).controls.storeUrl.markAsTouched();

    const row = toDeliveryLinkRows(profile.deliveryLinks, links)[0];

    expect(row.error).toBe('أدخل رابطاً كاملاً يبدأ بـ https://');
    expect(row.canOpen).toBe(false);
  });
});
