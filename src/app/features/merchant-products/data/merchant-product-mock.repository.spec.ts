import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { EMPTY_PRODUCT_DRAFT } from '../../../shared/models/empty-product-draft';
import { MerchantProductMockRepository } from './merchant-product-mock.repository';

const NOW = new Date('2026-09-28T12:00:00.000Z');
const DRAFT = { ...EMPTY_PRODUCT_DRAFT, name: 'سيروم', price: 350 };

function createRepository(): MerchantProductMockRepository {
  TestBed.configureTestingModule({
    providers: [MerchantProductMockRepository, { provide: CLOCK, useValue: () => NOW }],
  });
  return TestBed.inject(MerchantProductMockRepository);
}

describe('MerchantProductMockRepository', () => {
  it('serves the free plan with 3 of 5 products, all changed a week ago', async () => {
    const catalog = await firstValueFrom(createRepository().getCatalog());

    expect(catalog.plan.name).toBe('الباقة المجانية');
    expect(catalog.productLimit).toBe(5);
    expect(catalog.items).toHaveLength(3);
    expect(catalog.items[0].name).toBe('مرطب dove');
    expect(catalog.items.every((item) => item.updatedAt === '2026-09-21T12:00:00.000Z')).toBe(true);
  });

  it('adds, changes and deletes products for the next read', async () => {
    const repository = createRepository();

    const added = await firstValueFrom(repository.createProduct(DRAFT));
    expect(added.updatedAt).toBe(NOW.toISOString());
    await firstValueFrom(repository.updateProduct(added.id, { ...DRAFT, name: 'سيروم ليلي' }));
    await firstValueFrom(repository.deleteProduct('product-1'), { defaultValue: undefined });

    const names = (await firstValueFrom(repository.getCatalog())).items.map((item) => item.name);
    expect(names).not.toContain('مرطب dove');
    expect(names).toContain('سيروم ليلي');
  });

  it('refuses a product past the plan limit, as the server will', async () => {
    const repository = createRepository();
    await firstValueFrom(repository.createProduct(DRAFT));
    await firstValueFrom(repository.createProduct(DRAFT));

    await expect(firstValueFrom(repository.createProduct(DRAFT))).rejects.toThrow(
      'وصلت للحد المتاح في باقتك الحالية.',
    );
  });
});
