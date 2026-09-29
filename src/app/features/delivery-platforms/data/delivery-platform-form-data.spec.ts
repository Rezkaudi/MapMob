import { buildDeliveryPlatformDraft } from '../testing/delivery-platform-fixture';
import { toDeliveryPlatformFormData } from './delivery-platform-form-data';

const LOGO = new File(['x'], 'talabat.png', { type: 'image/png' });

describe('toDeliveryPlatformFormData', () => {
  it('sends every field as text', () => {
    const data = toDeliveryPlatformFormData(buildDeliveryPlatformDraft({ status: 'suspended' }));

    expect(data.get('name')).toBe('طلبات');
    expect(data.get('latinName')).toBe('talabat');
    expect(data.get('websiteUrl')).toBe('https://www.talabat.com');
    expect(data.get('status')).toBe('suspended');
    expect(data.get('sortOrder')).toBe('5');
  });

  it('sends a newly picked logo as a file', () => {
    const data = toDeliveryPlatformFormData(buildDeliveryPlatformDraft({ logoFile: LOGO }));

    expect(data.get('logo')).toBe(LOGO);
    expect(data.has('removeLogo')).toBe(false);
  });

  it('keeps the saved logo by sending nothing about it', () => {
    const data = toDeliveryPlatformFormData(
      buildDeliveryPlatformDraft({ logoUrl: 'https://cdn.test/talabat.png' }),
    );

    expect(data.has('logo')).toBe(false);
    expect(data.has('removeLogo')).toBe(false);
  });

  it('asks to drop the logo when there is none left', () => {
    const data = toDeliveryPlatformFormData(buildDeliveryPlatformDraft());

    expect(data.get('removeLogo')).toBe('true');
  });
});
