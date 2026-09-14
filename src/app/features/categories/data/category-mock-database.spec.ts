import { buildCategory } from '../testing/category-fixture';
import { CategoryMockDatabase } from './category-mock-database';

const RESTAURANTS = buildCategory({ id: 'm1', name: 'مطاعم' });
const CAFES = buildCategory({ id: 'm2', name: 'مقاهي', icon: 'coffee' });
const SEAFOOD = buildCategory({
  id: 's1',
  name: 'مطاعم بحرية',
  kind: 'sub',
  parentId: 'm1',
  parentName: 'مطاعم',
  placeCount: 12,
});

function createDatabase(): CategoryMockDatabase {
  return new CategoryMockDatabase([RESTAURANTS, CAFES, SEAFOOD]);
}

describe('CategoryMockDatabase', () => {
  it('lists every category and only the main ones for the parent pickers', () => {
    const database = createDatabase();

    expect(database.list()).toEqual([RESTAURANTS, CAFES, SEAFOOD]);
    expect(database.listMain()).toEqual([
      { id: 'm1', name: 'مطاعم' },
      { id: 'm2', name: 'مقاهي' },
    ]);
  });

  it('adds a new, active, empty sub category at the top with its parent name', () => {
    const database = createDatabase();

    const added = database.add({ name: 'مخابز', kind: 'sub', parentId: 'm2', icon: 'store' });

    expect(added).toMatchObject({
      name: 'مخابز',
      kind: 'sub',
      parentId: 'm2',
      parentName: 'مقاهي',
      icon: 'store',
      placeCount: 0,
      status: 'active',
    });
    expect(database.list()[0]).toEqual(added);
  });

  it('drops the parent of a main category', () => {
    const added = createDatabase().add({
      name: 'فنادق',
      kind: 'main',
      parentId: 'm1',
      icon: 'store',
    });

    expect(added.parentId).toBeNull();
    expect(added.parentName).toBeNull();
  });

  it('refuses a sub category without a known main category', () => {
    expect(() =>
      createDatabase().add({ name: 'مخابز', kind: 'sub', parentId: 'nope', icon: 'store' }),
    ).toThrowError('اختر التصنيف الرئيسي التابع له');
  });

  it('edits a category and keeps its counts and status', () => {
    const database = createDatabase();

    const updated = database.update('s1', {
      name: 'أسماك',
      kind: 'sub',
      parentId: 'm2',
      icon: 'coffee',
    });

    expect(updated).toMatchObject({ name: 'أسماك', parentName: 'مقاهي', placeCount: 12 });
    expect(database.list()[2]).toEqual(updated);
  });

  it('renames the parent shown on sub categories when a main category is renamed', () => {
    const database = createDatabase();

    database.update('m1', { name: 'مطاعم فاخرة', kind: 'main', parentId: null, icon: 'utensils' });

    expect(database.list()[2].parentName).toBe('مطاعم فاخرة');
  });

  it('changes a status', () => {
    expect(createDatabase().setStatus('m2', 'suspended').status).toBe('suspended');
  });

  it('deletes a main category together with its sub categories', () => {
    const database = createDatabase();

    database.remove('m1');

    expect(database.list()).toEqual([CAFES]);
  });

  it('fails on an unknown id', () => {
    expect(() => createDatabase().setStatus('nope', 'active')).toThrowError();
  });
});
