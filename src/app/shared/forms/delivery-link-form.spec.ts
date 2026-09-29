import { FormArray } from '@angular/forms';
import {
  DeliveryLinkFormGroup,
  createDeliveryLinkGroup,
  resizeDeliveryLinks,
  findDeliveryLinkError,
  resetDeliveryLinks,
  setDeliveryLinkEnabled,
} from './delivery-link-form';

function buildLink(isEnabled: boolean, storeUrl: string): DeliveryLinkFormGroup {
  const group = createDeliveryLinkGroup();
  group.setValue({ platformId: '1', isEnabled, storeUrl });
  return group;
}

describe('delivery link form', () => {
  it('asks for a link only while the platform is switched on', () => {
    expect(buildLink(true, '').controls.storeUrl.hasError('required')).toBe(true);
    expect(buildLink(false, '').valid).toBe(true);
  });

  it('wants a full web address, on or off', () => {
    expect(buildLink(true, 'beeorder.sy').controls.storeUrl.hasError('pattern')).toBe(true);
    expect(buildLink(false, 'beeorder').controls.storeUrl.hasError('pattern')).toBe(true);
    expect(buildLink(true, 'https://beeorder.sy/store/alhayat').valid).toBe(true);
  });

  it('checks the link again when the platform is switched on or off', () => {
    const link = buildLink(false, '');

    setDeliveryLinkEnabled(link, true);
    expect(link.controls.isEnabled.value).toBe(true);
    expect(link.controls.storeUrl.hasError('required')).toBe(true);
    expect(link.dirty).toBe(true);

    setDeliveryLinkEnabled(link, false);
    expect(link.valid).toBe(true);
  });

  it('grows or shrinks the list to the number of platforms', () => {
    const links = new FormArray<DeliveryLinkFormGroup>([]);

    resizeDeliveryLinks(links, 3);
    expect(links.length).toBe(3);

    resizeDeliveryLinks(links, 1);
    expect(links.length).toBe(1);
  });

  it('stays quiet about a link until it is touched', () => {
    const link = createDeliveryLinkGroup();
    setDeliveryLinkEnabled(link, true);

    expect(findDeliveryLinkError(link.controls.storeUrl, 'أدخل الرابط')).toBeNull();
  });

  it('asks for a missing link in the caller words, and for a full https link otherwise', () => {
    const link = createDeliveryLinkGroup();
    setDeliveryLinkEnabled(link, true);
    link.controls.storeUrl.markAsTouched();
    expect(findDeliveryLinkError(link.controls.storeUrl, 'أدخل الرابط')).toBe('أدخل الرابط');

    link.controls.storeUrl.setValue('talabat');
    expect(findDeliveryLinkError(link.controls.storeUrl, 'أدخل الرابط')).toBe(
      'أدخل رابطاً كاملاً يبدأ بـ https://',
    );
  });

  it('starts one switched-off row per platform, for a new place', () => {
    const links = new FormArray<DeliveryLinkFormGroup>([]);

    resetDeliveryLinks(links, [
      { id: '3', name: 'طلبات', latinName: 'Talabat', logoUrl: null },
      { id: '1', name: 'بي أوردر', latinName: 'BeeOrder', logoUrl: null },
    ]);

    expect(links.getRawValue()).toEqual([
      { platformId: '3', isEnabled: false, storeUrl: '' },
      { platformId: '1', isEnabled: false, storeUrl: '' },
    ]);
    expect(links.pristine).toBe(true);
  });
});
