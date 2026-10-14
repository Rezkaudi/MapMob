import { LIVE_MAIN_CATEGORY, LIVE_SUB_CATEGORY } from '../testing/live-category-fixture';
import { toCategory, toLiveCategoryForm } from './live-category-mapping';

describe('live category mapping', () => {
  it('reads a main category with its Arabic name and uploaded icon', () => {
    expect(toCategory(LIVE_MAIN_CATEGORY, [LIVE_MAIN_CATEGORY])).toEqual({
      id: '1',
      name: 'مطاعم',
      kind: 'main',
      parentId: null,
      parentName: null,
      icon: '',
      iconUrl: 'https://api.test/storage/categories/icons/a.jpg',
      color: '#FF8104',
      placeCount: 2,
      status: 'active',
      updatedAt: '2026-10-10T17:41:31.000000Z',
    });
  });

  it("reads a switched off sub category under its parent's Arabic name", () => {
    const category = toCategory(LIVE_SUB_CATEGORY, [LIVE_MAIN_CATEGORY, LIVE_SUB_CATEGORY]);

    expect(category.kind).toBe('sub');
    expect(category.parentId).toBe('1');
    expect(category.parentName).toBe('مطاعم');
    expect(category.status).toBe('suspended');
  });

  it('falls back to the plain name and the brand colour when the server leaves them out', () => {
    const category = toCategory(
      { ...LIVE_MAIN_CATEGORY, translations: { name: [] }, icon_color: null },
      [],
    );

    expect(category.name).toBe('Restaurants');
    expect(category.color).toBe('#0583EC');
  });

  it('writes a sub category draft as form fields, with the icon file when one is given', () => {
    const icon = new File(['x'], 'store.png', { type: 'image/png' });
    const form = toLiveCategoryForm(
      { name: 'مخابز', kind: 'sub', parentId: '1', icon: 'store', color: '#0583EC' },
      icon,
    );

    expect(form.get('name[ar]')).toBe('مخابز');
    expect(form.get('name[en]')).toBe('مخابز');
    expect(form.get('slug')).toBe('مخابز');
    expect(form.get('parent_id')).toBe('1');
    expect(form.get('icon_color')).toBe('#0583EC');
    expect(form.get('icon')).toBe(icon);
  });

  it('sends no parent for a main category and no icon when none was picked', () => {
    const form = toLiveCategoryForm(
      { name: 'مطاعم', kind: 'main', parentId: '1', icon: '', color: '#0583EC' },
      null,
    );

    expect(form.get('parent_id')).toBe('');
    expect(form.has('icon')).toBe(false);
  });
});
