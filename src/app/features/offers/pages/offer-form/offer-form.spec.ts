import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { of } from 'rxjs';
import { OfferRepository } from '../../data/offer.repository';
import { OfferDraft } from '../../models/offer-draft';
import { buildOffer, buildOfferDetail } from '../../testing/offer-fixture';
import { OfferForm } from './offer-form';

const DETAIL = buildOfferDetail();
const OPTIONS = {
  places: [
    DETAIL.place,
    { id: 'place-3', name: 'صيدلية الحياة', categoryName: 'صيدلية', address: 'طرطوس' },
  ],
  categoryNames: ['ألبسة', 'صيدلية'],
};
const ITEMS = [
  { id: 'place-3-item-1', name: 'شامبو 1', price: 200 },
  { id: 'place-3-item-2', name: 'عطر 2', price: 900 },
];

function createPage(editingId?: string) {
  const created: OfferDraft[] = [];
  const updated: [string, OfferDraft][] = [];
  const repository: Partial<OfferRepository> = {
    getFormOptions: () => of(OPTIONS),
    getOfferDetail: () => of(DETAIL),
    getPlaceItems: () => of(ITEMS),
    createOffer: (draft) => {
      created.push(draft);
      return of(buildOffer());
    },
    updateOffer: (id, draft) => {
      updated.push([id, draft]);
      return of(buildOffer());
    },
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: OfferRepository, useValue: repository }],
  });
  const navigateByUrl = vi.spyOn(TestBed.inject(Router), 'navigateByUrl').mockResolvedValue(true);
  const fixture = TestBed.createComponent(OfferForm);
  if (editingId) {
    fixture.componentRef.setInput('id', editingId);
  }
  fixture.detectChanges();
  return {
    fixture,
    element: fixture.nativeElement as HTMLElement,
    created,
    updated,
    navigateByUrl,
  };
}

type Page = ReturnType<typeof createPage>;

function control<T extends HTMLElement>(element: HTMLElement, selector: string): T {
  return element.querySelector(selector) as T;
}

function type(page: Page, selector: string, value: string): void {
  const input = control<HTMLInputElement | HTMLTextAreaElement>(page.element, selector);
  input.value = value;
  input.dispatchEvent(new Event('input'));
  page.fixture.detectChanges();
}

function choose(page: Page, selector: string, value: string): void {
  const select = control<HTMLSelectElement>(page.element, selector);
  select.value = value;
  select.dispatchEvent(new Event('change'));
  page.fixture.detectChanges();
}

function pickDay(page: Page, label: string, day: string): void {
  const input = control<HTMLInputElement>(page.element, `input[aria-label="${label}"]`);
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
  choose(page, '#offer-place', 'place-3');
  pickDay(page, 'تاريخ بداية العرض', '2026-09-01');
  pickDay(page, 'تاريخ انتهاء العرض', '2026-09-30');
}

async function settle(page: Page): Promise<void> {
  await page.fixture.whenStable();
  page.fixture.detectChanges();
}

describe('OfferForm', () => {
  it('lays out the add page as the design does', () => {
    const { element } = createPage();
    const text = element.textContent ?? '';

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('إضافة عرض جديد');
    expect(element.querySelector('nav a')?.textContent?.trim()).toBe('العروض');
    for (const words of [
      'أضف عرضاً جديداً ليظهر للمستخدمين ضمن العروض المتاحة.',
      'المعلومات الأساسية للعرض',
      'اسم العرض',
      'قيمة الخصم',
      'المتجر/الشركة المقدمة للعرض',
      'الصنيف الرئيسي لهذه الشركة/المتجر',
      'مدة العرض',
      'حالة العرض',
      'وصف العرض',
      'نطاق العرض',
      'صورة العرض',
    ]) {
      expect(text).toContain(words);
    }
    expect(control<HTMLInputElement>(element, '#offer-title').placeholder).toBe(
      'خصم 30% على جميع المنتجات',
    );
    expect(
      element.querySelector('app-form-action-bar button[type="submit"]')?.textContent?.trim(),
    ).toBe('حفظ العرض');
  });

  it('explains what is missing instead of saving an empty form', async () => {
    const page = createPage();

    buttonNamed(page.element, 'حفظ العرض').click();
    await settle(page);

    expect(page.created).toEqual([]);
    expect(page.element.textContent).toContain('اكتب اسم العرض');
    expect(page.element.textContent).toContain('اختر تاريخ بداية العرض وتاريخ انتهائه');
  });

  it('fills the category from the picked store and lists its items for a picked-items offer', () => {
    const page = createPage();

    choose(page, '#offer-place', 'place-3');
    (
      page.element.querySelectorAll('app-offer-scope-picker [role="radio"]')[1] as HTMLButtonElement
    ).click();
    page.fixture.detectChanges();

    expect(control<HTMLSelectElement>(page.element, '#offer-category').value).toBe('صيدلية');
    expect(page.element.querySelectorAll('app-offer-item-picker li')).toHaveLength(2);
  });

  it('publishes a filled offer with its picked items, then goes back to the list', async () => {
    const page = createPage();
    fillRequiredFields(page);
    (
      page.element.querySelectorAll('app-offer-scope-picker [role="radio"]')[1] as HTMLButtonElement
    ).click();
    page.fixture.detectChanges();
    (page.element.querySelector('app-offer-item-picker li input') as HTMLInputElement).click();
    page.fixture.detectChanges();

    buttonNamed(page.element, 'حفظ العرض').click();
    await settle(page);

    expect(page.created).toHaveLength(1);
    expect(page.created[0]).toMatchObject({
      title: 'خصم الشتاء',
      discountPercent: 25,
      placeId: 'place-3',
      categoryName: 'صيدلية',
      startsOn: '2026-09-01',
      endsOn: '2026-09-30',
      status: 'active',
      scope: 'selectedItems',
      itemIds: ['place-3-item-1'],
    });
    expect(page.navigateByUrl).toHaveBeenCalledWith('/offers');
  });

  it('saves a draft from "حفظ كمسودة"', async () => {
    const page = createPage();
    fillRequiredFields(page);
    choose(page, '#offer-status', 'paused');

    buttonNamed(page.element, 'حفظ كمسودة').click();
    await settle(page);

    expect(page.created[0].status).toBe('draft');
  });

  it('opens an offer for editing with its saved values, and updates it', async () => {
    const page = createPage('offer-2');

    expect(page.element.querySelector('h1')?.textContent?.trim()).toBe('تعديل العرض');
    expect(control<HTMLInputElement>(page.element, '#offer-title').value).toBe(
      'خصم 30% على جميع الأزياء الشتوية',
    );
    expect(control<HTMLSelectElement>(page.element, '#offer-place').value).toBe('place-7');

    buttonNamed(page.element, 'حفظ العرض').click();
    await settle(page);

    expect(page.updated.map(([id]) => id)).toEqual(['offer-2']);
    expect(page.updated[0][1].itemIds).toEqual(['place-7-item-1', 'place-7-item-2']);
    expect(page.navigateByUrl).toHaveBeenCalledWith('/offers');
  });
});
