import { CATEGORY_ICONS, categoryIconAssetName } from './category-icon';

describe('category icons', () => {
  it('offers the ten icons of the design picker, in its reading order', () => {
    expect(CATEGORY_ICONS).toEqual([
      'utensils',
      'coffee',
      'library',
      'dumbbell',
      'cart',
      'pill',
      'store',
      'shirt',
      'scissors',
      'gift',
    ]);
  });

  it('names the asset file of an icon', () => {
    expect(categoryIconAssetName('coffee')).toBe('category-coffee');
  });
});
