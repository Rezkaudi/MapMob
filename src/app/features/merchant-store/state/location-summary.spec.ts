import { describeStoreLocation } from './location-summary';

describe('describeStoreLocation', () => {
  it('writes the governorate, then the address', () => {
    expect(describeStoreLocation('طرطوس', 'شارع الثورة، بناء رقم 12')).toBe(
      'طرطوس، شارع الثورة، بناء رقم 12',
    );
  });

  it('shows the governorate alone while the address is empty', () => {
    expect(describeStoreLocation('طرطوس', '   ')).toBe('طرطوس');
  });
});
