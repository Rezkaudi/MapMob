import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { EMPTY_PRODUCT_DRAFT } from '../../../shared/models/empty-product-draft';
import { ProductDraft } from '../../../shared/models/product-draft';
import { MerchantProductRepository } from '../data/merchant-product.repository';
import { MerchantProduct } from '../models/merchant-product';
import { MerchantProductCatalog } from '../models/merchant-product-catalog';
import {
  buildMerchantProduct,
  buildMerchantProductCatalog,
} from '../testing/merchant-product-fixture';
import { MerchantProductsStore } from './merchant-products.store';

const NOW = new Date('2026-09-28T12:00:00.000Z');
const CREAM = buildMerchantProduct({ id: '1', name: 'مرطب dove' });
const SERUM = buildMerchantProduct({ id: '2', name: 'سيروم', isAvailable: false });
const DRAFT: ProductDraft = { ...EMPTY_PRODUCT_DRAFT, name: 'جل', price: 90 };

class FakeRepository extends MerchantProductRepository {
  catalog: MerchantProductCatalog = buildMerchantProductCatalog({ items: [CREAM, SERUM] });
  failure: Error | null = null;
  created: ProductDraft[] = [];
  updated: [string, ProductDraft][] = [];
  deleted: string[] = [];

  getCatalog(): Observable<MerchantProductCatalog> {
    return this.failure ? throwError(() => this.failure) : of(this.catalog);
  }
  createProduct(draft: ProductDraft): Observable<MerchantProduct> {
    this.created.push(draft);
    return this.answer(buildMerchantProduct({ id: '3', name: draft.name }));
  }
  updateProduct(id: string, draft: ProductDraft): Observable<MerchantProduct> {
    this.updated.push([id, draft]);
    return this.answer(buildMerchantProduct({ id, name: draft.name }));
  }
  deleteProduct(id: string): Observable<void> {
    this.deleted.push(id);
    return this.answer(undefined);
  }
  private answer<T>(value: T): Observable<T> {
    return this.failure ? throwError(() => this.failure) : of(value);
  }
}

function setUp(configure: (repository: FakeRepository) => void = () => undefined) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      MerchantProductsStore,
      { provide: MerchantProductRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  const store = TestBed.inject(MerchantProductsStore);
  store.load();
  return { store, repository };
}

describe('MerchantProductsStore', () => {
  it('loads the products, the counts and the plan quota', () => {
    const { store } = setUp();

    expect(store.rows().map((row) => row.product.id)).toEqual(['1', '2']);
    expect(store.counts()).toEqual({ total: 2, available: 1, unavailable: 1 });
    expect(store.planName()).toBe('الباقة المجانية');
    expect(store.quota()?.limitText).toBe('/ 5 منتجات');
    expect(store.rows()[0].updatedText).toBe('منذ أسبوع');
  });

  it('keeps the load error for the page to show', () => {
    const { store } = setUp((repository) => (repository.failure = new Error('انقطع الاتصال')));

    expect(store.error()).toBe('انقطع الاتصال');
  });

  it('searches and sorts the rows without touching the counts', () => {
    const { store } = setUp();

    store.setSearch('سير');
    expect(store.rows().map((row) => row.product.id)).toEqual(['2']);
    expect(store.counts().total).toBe(2);

    store.setSearch('');
    store.setSort('name');
    expect(store.rows().map((row) => row.product.id)).toEqual(['2', '1']);
  });

  it('says "nothing matched" when a search hides every row', () => {
    const { store } = setUp();

    store.setSearch('غير موجود');

    expect(store.hasNoRows()).toBe(true);
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة لبحثك');
  });

  it('says "no products yet" when the place has none', () => {
    const { store } = setUp((fake) => (fake.catalog = { ...fake.catalog, items: [] }));

    expect(store.hasNoRows()).toBe(true);
    expect(store.emptyMessage()).toBe('لم تضف أي منتج أو خدمة بعد');
  });

  it('ticks every visible row, then clears them all', () => {
    const { store } = setUp();

    store.toggleAllVisible();
    expect(store.areAllVisibleSelected()).toBe(true);
    store.toggleAllVisible();
    expect(store.selectedIds()).toEqual([]);
  });

  it('adds a product from the dialog and closes it', async () => {
    const { store, repository } = setUp();

    store.openCreate();
    expect(store.formDialog()).toEqual({ mode: 'create', draft: EMPTY_PRODUCT_DRAFT });
    await store.submitDraft(DRAFT);

    expect(repository.created).toEqual([DRAFT]);
    expect(store.rows().map((row) => row.product.name)).toContain('جل');
    expect(store.formDialog()).toBeNull();
  });

  it('does not open the add dialog once the plan is full', () => {
    const { store } = setUp((fake) => (fake.catalog = { ...fake.catalog, productLimit: 2 }));

    store.openCreate();

    expect(store.quota()?.isFull).toBe(true);
    expect(store.formDialog()).toBeNull();
  });

  it('edits a product in place', async () => {
    const { store, repository } = setUp();

    store.openEdit(CREAM);
    expect(store.formDialog()?.mode).toBe('edit');
    expect(store.formDialog()?.draft.name).toBe('مرطب dove');
    await store.submitDraft(DRAFT);

    expect(repository.updated).toEqual([['1', DRAFT]]);
    expect(store.rows()[0].product.name).toBe('جل');
  });

  it('asks before deleting, then drops the row and its tick', async () => {
    const { store, repository } = setUp();
    store.toggleSelected('1');

    store.openDelete(CREAM);
    expect(store.deleteCopy()?.question).toBe('هل أنت متأكد من حذف مرطب dove؟');
    await store.confirmDelete();

    expect(repository.deleted).toEqual(['1']);
    expect(store.rows().map((row) => row.product.id)).toEqual(['2']);
    expect(store.selectedIds()).toEqual([]);
    expect(store.deleteCopy()).toBeNull();
  });

  it('keeps the dialog open with the error when a save fails', async () => {
    const { store, repository } = setUp();
    store.openCreate();
    repository.failure = new Error('وصلت للحد المتاح في باقتك الحالية.');

    await store.submitDraft(DRAFT);

    expect(store.formDialog()).not.toBeNull();
    expect(store.saveError()).toBe('وصلت للحد المتاح في باقتك الحالية.');
    store.closeDialog();
    expect(store.saveError()).toBeNull();
  });
});
