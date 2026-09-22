import {
  CATEGORY_ICONS,
  DEFAULT_CATEGORY_ICON,
  findCategoryIcon,
  searchCategoryIcons,
} from './category-icon';

describe('category icons', () => {
  it('leads with the ten icons the design draws, in its reading order', () => {
    expect(CATEGORY_ICONS.slice(0, 10).map((icon) => icon.name)).toEqual([
      'utensils-crossed',
      'coffee',
      'library-big',
      'dumbbell',
      'shopping-cart',
      'pill',
      'store',
      'shirt',
      'scissors',
      'gift',
    ]);
  });

  it('starts on the icon the design marks as picked', () => {
    expect(DEFAULT_CATEGORY_ICON).toBe('utensils-crossed');
  });

  it('carries Lucide drawing data for every icon, so none renders blank', () => {
    for (const icon of CATEGORY_ICONS) {
      expect(icon.data, icon.name).toBeTruthy();
    }
  });

  it('gives every icon an Arabic label', () => {
    for (const icon of CATEGORY_ICONS) {
      expect(icon.label, icon.name).not.toBe('');
    }
  });

  it('has no duplicate names', () => {
    const names = CATEGORY_ICONS.map((icon) => icon.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it('finds one icon by name', () => {
    expect(findCategoryIcon('coffee')?.label).toBe('مقاهي');
    expect(findCategoryIcon('not-an-icon')).toBeNull();
  });
});

describe('searchCategoryIcons', () => {
  it('returns every icon for an empty search', () => {
    expect(searchCategoryIcons('')).toEqual(CATEGORY_ICONS);
    expect(searchCategoryIcons('   ')).toEqual(CATEGORY_ICONS);
  });

  it('matches the Arabic label', () => {
    expect(searchCategoryIcons('مقاهي').map((icon) => icon.name)).toContain('coffee');
  });

  it('matches part of an Arabic label', () => {
    expect(searchCategoryIcons('مطاع').map((icon) => icon.name)).toContain('utensils-crossed');
  });

  it('matches the Lucide name, so the library can be searched in English', () => {
    expect(searchCategoryIcons('coffee').map((icon) => icon.name)).toContain('coffee');
    expect(searchCategoryIcons('CART').map((icon) => icon.name)).toContain('shopping-cart');
  });

  it('matches an English keyword that is not in the name', () => {
    expect(searchCategoryIcons('pharmacy').map((icon) => icon.name)).toContain('pill');
  });

  it('finds nothing for a term no icon carries', () => {
    expect(searchCategoryIcons('zzzznope')).toEqual([]);
  });
});
