import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../../core/config/clock';
import { ProductDraft } from '../../../../shared/models/product-draft';
import { RowActionsMenu } from '../../../../shared/ui/row-actions-menu/row-actions-menu';
import { MerchantProductRepository } from '../../data/merchant-product.repository';
import { MerchantProduct } from '../../models/merchant-product';
import { MerchantProductCatalog } from '../../models/merchant-product-catalog';
import {
  buildMerchantProduct,
  buildMerchantProductCatalog,
} from '../../testing/merchant-product-fixture';
import { MerchantProductsPage } from './merchant-products-page';

const NOW = new Date('2026-09-28T12:00:00.000Z');

class FakeRepository extends MerchantProductRepository {
  catalog: MerchantProductCatalog = buildMerchantProductCatalog({
    items: [buildMerchantProduct({ id: '1' }), buildMerchantProduct({ id: '2', name: 'سيروم' })],
  });
  isFailing = false;

  getCatalog(): Observable<MerchantProductCatalog> {
    return this.isFailing ? throwError(() => new Error('انقطع الاتصال')) : of(this.catalog);
  }
  createProduct(draft: ProductDraft): Observable<MerchantProduct> {
    return of(buildMerchantProduct({ id: '3', name: draft.name }));
  }
  updateProduct(id: string, draft: ProductDraft): Observable<MerchantProduct> {
    return of(buildMerchantProduct({ id, name: draft.name }));
  }
  deleteProduct(): Observable<void> {
    return of(undefined);
  }
}

function build(configure: (repository: FakeRepository) => void = () => undefined) {
  const repository = new FakeRepository();
  configure(repository);
  TestBed.configureTestingModule({
    providers: [
      provideRouter([]),
      { provide: MerchantProductRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  const fixture = TestBed.createComponent(MerchantProductsPage);
  fixture.detectChanges();
  return fixture;
}

function rowNames(host: HTMLElement): string[] {
  return [...host.querySelectorAll('tbody tr td:nth-child(3)')].map(
    (cell) => cell.textContent?.trim() ?? '',
  );
}

async function settle(fixture: ReturnType<typeof build>): Promise<void> {
  await fixture.whenStable();
  fixture.detectChanges();
}

describe('MerchantProductsPage', () => {
  it('shows the header, the usage card, the tiles, the toolbar and the table in order', () => {
    const host: HTMLElement = build().nativeElement;

    expect(host.querySelector('h1')?.textContent?.trim()).toBe('الخدمات و المنتجات');
    expect(host.textContent).toContain('إدارة الخدمات و المنتجات التي تظهر في صفحة مكانك .');
    expect(host.querySelector('app-add-button')?.textContent?.trim()).toBe('إضافة خدمة أو منتج');
    expect([...host.children].map((child) => child.tagName.toLowerCase())).toEqual([
      'app-page-header',
      'div',
      'app-product-toolbar',
      'app-product-table',
    ]);
    expect(
      [...host.querySelector('[data-role="quota-grid"]')!.children].map((child) =>
        child.tagName.toLowerCase(),
      ),
    ).toEqual(['app-product-usage-card', 'app-product-count-tiles']);
    expect(rowNames(host)).toEqual(['مرطب dove', 'سيروم']);
  });

  it('filters the rows from the search box', () => {
    const fixture = build();
    const search = fixture.nativeElement.querySelector('input[type="search"]') as HTMLInputElement;

    search.value = 'سير';
    search.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(rowNames(fixture.nativeElement)).toEqual(['سيروم']);
  });

  it('adds a product through the dialog, which leaves out the order link hint', async () => {
    const fixture = build();
    const host: HTMLElement = fixture.nativeElement;

    host.querySelector<HTMLButtonElement>('app-add-button button')!.click();
    fixture.detectChanges();
    expect(host.querySelector('app-product-dialog')).not.toBeNull();
    expect(host.textContent).not.toContain('يستخدم لنقل المستخدم');

    const name = host.querySelector('[data-testid="product-name"]') as HTMLInputElement;
    name.value = 'جل';
    name.dispatchEvent(new Event('input'));
    const price = host.querySelector('[data-testid="product-price"]') as HTMLInputElement;
    price.value = '90';
    price.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    host.querySelector<HTMLButtonElement>('[data-testid="submit-product"]')!.click();
    await settle(fixture);

    expect(host.querySelector('app-product-dialog')).toBeNull();
    expect(rowNames(host)).toEqual(['مرطب dove', 'سيروم', 'جل']);
  });

  it('asks before deleting a row from its menu', async () => {
    const fixture = build();
    const host: HTMLElement = fixture.nativeElement;

    const menus = fixture.debugElement.queryAll(By.directive(RowActionsMenu));
    (menus[0].componentInstance as RowActionsMenu).remove.emit();
    fixture.detectChanges();
    const dialog = host.querySelector('app-confirm-action-dialog') as HTMLElement;
    expect(dialog.textContent).toContain('هل أنت متأكد من حذف مرطب dove؟');

    const confirm = [...dialog.querySelectorAll('button')].find(
      (button) => button.textContent?.trim() === 'حذف',
    ) as HTMLButtonElement;
    confirm.click();
    await settle(fixture);

    expect(host.querySelector('app-confirm-action-dialog')).toBeNull();
    expect(rowNames(host)).toEqual(['سيروم']);
  });

  it('turns the add button off once the plan is full', () => {
    const fixture = build((fake) => (fake.catalog = { ...fake.catalog, productLimit: 2 }));

    const add = fixture.nativeElement.querySelector('app-add-button button') as HTMLButtonElement;

    expect(add.disabled).toBe(true);
  });

  it('shows the load error with a retry in place of the page body', () => {
    const host: HTMLElement = build((fake) => (fake.isFailing = true)).nativeElement;

    expect(host.querySelector('app-error-state')?.textContent).toContain('انقطع الاتصال');
    expect(host.querySelector('app-product-table')).toBeNull();
  });
});
