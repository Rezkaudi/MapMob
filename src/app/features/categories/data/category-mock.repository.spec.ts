import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { buildCategory } from '../testing/category-fixture';
import { CategoryMockDatabase } from './category-mock-database';
import { CategoryMockRepository } from './category-mock.repository';

const RESTAURANTS = buildCategory({ id: 'm1', name: 'مطاعم' });
const SEAFOOD = buildCategory({ id: 's1', name: 'مطاعم بحرية', kind: 'sub', parentId: 'm1' });

describe('CategoryMockRepository', () => {
  let repository: CategoryMockRepository;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryMockRepository,
        {
          provide: CategoryMockDatabase,
          useValue: new CategoryMockDatabase([RESTAURANTS, SEAFOOD]),
        },
      ],
    });
    repository = TestBed.inject(CategoryMockRepository);
  });

  it('pages and counts the stored categories', async () => {
    const page = await firstValueFrom(
      repository.getCategories({ pageIndex: 0, pageSize: 5, kind: 'main' }),
    );

    expect(page.items).toEqual([RESTAURANTS]);
    expect(page.kindCounts).toEqual({ all: 2, main: 1, sub: 1 });
  });

  it('lists the main categories', async () => {
    expect(await firstValueFrom(repository.getMainCategories())).toEqual([
      { id: 'm1', name: 'مطاعم' },
    ]);
  });

  it('writes through to the database', async () => {
    const created = await firstValueFrom(
      repository.createCategory({ name: 'فنادق', kind: 'main', parentId: null, icon: 'store' }),
    );
    await firstValueFrom(repository.updateCategory(created.id, { ...created, name: 'فنادق فخمة' }));
    await firstValueFrom(repository.setCategoryStatus(created.id, 'suspended'));
    const page = await firstValueFrom(repository.getCategories({ pageIndex: 0, pageSize: 5 }));
    expect(page.items[0]).toMatchObject({ name: 'فنادق فخمة', status: 'suspended' });

    await firstValueFrom(repository.deleteCategory('m1'), { defaultValue: null });
    const afterDelete = await firstValueFrom(
      repository.getCategories({ pageIndex: 0, pageSize: 5 }),
    );
    expect(afterDelete.items.map((category) => category.id)).toEqual([created.id]);
  });

  it('reports a failed write as an error', async () => {
    await expect(
      firstValueFrom(
        repository.createCategory({ name: 'مخابز', kind: 'sub', parentId: null, icon: 'store' }),
      ),
    ).rejects.toThrowError('اختر التصنيف الرئيسي التابع له');
  });
});
