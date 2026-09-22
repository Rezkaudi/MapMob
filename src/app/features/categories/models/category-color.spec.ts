import { CATEGORY_COLORS, DEFAULT_CATEGORY_COLOR } from './category-color';

describe('category colours', () => {
  it('offers the thirteen swatches of the design, right to left', () => {
    expect(CATEGORY_COLORS).toEqual([
      '#FF8104',
      '#006F69',
      '#FC0303',
      '#03732B',
      '#5977FF',
      '#55B4AF',
      '#F4D400',
      '#0583EC',
      '#0F172A',
      '#10B981',
      '#1027B9',
      '#4B2996',
      '#D141DF',
    ]);
  });

  it('starts on the brand blue', () => {
    expect(DEFAULT_CATEGORY_COLOR).toBe('#0583EC');
  });
});
