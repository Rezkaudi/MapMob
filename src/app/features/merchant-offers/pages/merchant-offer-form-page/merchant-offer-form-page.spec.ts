import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { MerchantOfferRepository } from '../../data/merchant-offer.repository';
import { buildMerchantOffer } from '../../testing/merchant-offer-fixture';
import { FakeMerchantOfferRepository } from '../../testing/fake-merchant-offer-repository';
import { MerchantOfferFormPage } from './merchant-offer-form-page';

function createPage(id?: string) {
  const repository = new FakeMerchantOfferRepository();
  repository.catalog = {
    ...repository.catalog,
    items: [
      buildMerchantOffer({
        id: 'offer-2',
        title: 'خصم الخريف',
        status: 'paused',
        itemIds: ['product-1'],
      }),
    ],
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: MerchantOfferRepository, useValue: repository }],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(MerchantOfferFormPage);
  if (id) {
    fixture.componentRef.setInput('id', id);
  }
  fixture.detectChanges();
  TestBed.tick();
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, repository, navigateByUrl };
}

type Page = ReturnType<typeof createPage>;

function type(page: Page, selector: string, value: string): void {
  const input = page.element.querySelector(selector) as HTMLInputElement;
  input.value = value;
  input.dispatchEvent(new Event('input'));
  page.fixture.detectChanges();
}

function pickDay(page: Page, label: string, day: string): void {
  const input = page.element.querySelector(`input[aria-label="${label}"]`) as HTMLInputElement;
  input.value = day;
  input.dispatchEvent(new Event('change'));
  page.fixture.detectChanges();
}

function buttonNamed(root: ParentNode, label: string): HTMLButtonElement {
  return Array.from(root.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function fillRequiredFields(page: Page): void {
  type(page, '#offer-title', 'خصم الشتاء');
  type(page, '#offer-discount', '25');
  pickDay(page, 'تاريخ بداية العرض', '2026-09-01');
  pickDay(page, 'تاريخ انتهاء العرض', '2026-09-30');
}

async function settle(page: Page): Promise<void> {
  await page.fixture.whenStable();
  page.fixture.detectChanges();
}

describe('MerchantOfferFormPage', () => {
  it('lays out the add page as the frame does, with no place or category fields', () => {
    const { element } = createPage();

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('إضافة عرض جديد');
    expect(element.querySelector('nav a')?.textContent?.trim()).toBe('العروض');
    expect(element.querySelector('nav a')?.getAttribute('href')).toBe('/merchant/offers');
    expect(element.textContent).toContain('المعلومات الأساسية للعرض');
    expect(element.querySelector('#offer-place')).toBeNull();
    expect(element.querySelector('#offer-category')).toBeNull();
    expect(
      element.querySelector('app-form-action-bar button[type="submit"]')?.textContent?.trim(),
    ).toBe('حفظ العرض');
  });

  it('explains what is missing instead of saving an empty form', async () => {
    const page = createPage();

    buttonNamed(page.element, 'حفظ العرض').click();
    await settle(page);

    expect(page.repository.created).toEqual([]);
    expect(page.element.textContent).toContain('اكتب اسم العرض');
  });

  it('publishes a filled offer with its picked products, then goes back to the list', async () => {
    const page = createPage();
    fillRequiredFields(page);
    (
      page.element.querySelectorAll('app-offer-scope-picker [role="radio"]')[1] as HTMLElement
    ).click();
    page.fixture.detectChanges();
    (page.element.querySelector('app-offer-item-picker li input') as HTMLInputElement).click();

    buttonNamed(page.element, 'حفظ العرض').click();
    await settle(page);

    expect(page.repository.created).toEqual([
      {
        title: 'خصم الشتاء',
        discountPercent: 25,
        startsOn: '2026-09-01',
        endsOn: '2026-09-30',
        status: 'active',
        description: '',
        scope: 'selectedItems',
        itemIds: ['product-1'],
        image: null,
        isImageRemoved: false,
      },
    ]);
    expect(page.navigateByUrl).toHaveBeenCalledWith('/merchant/offers');
  });

  it('saves a draft from "حفظ كمسودة"', async () => {
    const page = createPage();
    fillRequiredFields(page);

    buttonNamed(page.element, 'حفظ كمسودة').click();
    await settle(page);

    expect(page.repository.created[0].status).toBe('draft');
  });

  it('opens an offer for editing with its saved values, and updates it', async () => {
    const page = createPage('offer-2');

    expect(page.element.querySelector('h1')?.textContent?.trim()).toBe('تعديل العرض');
    expect((page.element.querySelector('#offer-title') as HTMLInputElement).value).toBe(
      'خصم الخريف',
    );
    expect((page.element.querySelector('#offer-status') as HTMLSelectElement).value).toBe('paused');

    buttonNamed(page.element, 'حفظ العرض').click();
    await settle(page);

    expect(page.repository.updated.map(([id]) => id)).toEqual(['offer-2']);
    expect(page.repository.updated[0][1]).toMatchObject({
      status: 'paused',
      itemIds: ['product-1'],
    });
    expect(page.navigateByUrl).toHaveBeenCalledWith('/merchant/offers');
  });
});
