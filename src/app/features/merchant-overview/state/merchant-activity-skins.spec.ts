import { MERCHANT_ACTIVITY_SKINS } from './merchant-activity-skins';

describe('MERCHANT_ACTIVITY_SKINS', () => {
  it('tints a review row amber with a star, as the first row of the design', () => {
    expect(MERCHANT_ACTIVITY_SKINS.review).toEqual({
      icon: 'star-feather',
      rowClass: 'bg-[#ffb95f]/20',
      tileClass: 'bg-[#ffb564]',
    });
  });

  it('tints an offer row blue with a tag', () => {
    expect(MERCHANT_ACTIVITY_SKINS.offer.icon).toBe('tag-feather');
    expect(MERCHANT_ACTIVITY_SKINS.offer.tileClass).toBe('bg-[#2291ee]');
  });

  it('tints an alert row red', () => {
    expect(MERCHANT_ACTIVITY_SKINS.alert.rowClass).toBe('bg-[#ffdad6]/30');
    expect(MERCHANT_ACTIVITY_SKINS.alert.tileClass).toBe('bg-[#ff8174]');
  });
});
