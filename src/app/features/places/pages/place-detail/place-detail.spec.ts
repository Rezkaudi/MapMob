import { Router, provideRouter } from '@angular/router';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NEVER, of, throwError } from 'rxjs';
import { PlaceRepository } from '../../data/place.repository';
import { createPlaceDetail } from '../../testing/place-detail-fixture';
import { PlaceDetail } from './place-detail';

describe('PlaceDetail', () => {
  function render() {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PlaceRepository, useValue: { getPlace: () => of(createPlaceDetail()) } },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();
    return fixture;
  }

  function openProductMenu(fixture: ReturnType<typeof render>, row = 0): HTMLElement {
    const cards = fixture.nativeElement.querySelectorAll('app-place-products-card app-action-menu');
    (cards[row].querySelector('button') as HTMLElement).click();
    fixture.detectChanges();
    return cards[row].querySelector('[data-testid="action-menu-panel"]') as HTMLElement;
  }

  function pickFromMenu(fixture: ReturnType<typeof render>, label: string, row = 0): void {
    const panel = openProductMenu(fixture, row);
    Array.from(panel.querySelectorAll('button'))
      .find((button) => button.textContent?.includes(label))!
      .click();
    fixture.detectChanges();
  }

  it('edits a product from its menu, filling the dialog and keeping the change', () => {
    const fixture = render();

    pickFromMenu(fixture, 'تعديل');
    const name: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="product-name"]',
    );
    expect(name.value).toBe('سيروم تحت العين');

    name.value = 'سيروم بعد التعديل';
    name.dispatchEvent(new Event('input'));
    fixture.detectChanges();
    (fixture.nativeElement.querySelector('[data-testid="submit-product"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('app-product-dialog')).toBeNull();
    expect(productRows(fixture)[0].textContent).toContain('سيروم بعد التعديل');
  });

  it('flips a product between متاح and غير متاح from its menu', () => {
    const fixture = render();
    expect(productRows(fixture)[0].textContent).toContain('متاح');

    pickFromMenu(fixture, 'تغيير الحالة');

    expect(productRows(fixture)[0].textContent).toContain('غير متاح');
  });

  it('asks before deleting a product, and keeps it when the admin backs out', () => {
    const fixture = render();
    const before = productRows(fixture).length;

    pickFromMenu(fixture, 'حذف');
    expect(fixture.nativeElement.textContent).toContain('حذف المنتج أو الخدمة');
    expect(productRows(fixture)).toHaveLength(before);

    clickByText(fixture, 'إلغاء');

    expect(productRows(fixture)).toHaveLength(before);
  });

  it('deletes the product once the admin confirms', () => {
    const fixture = render();
    const before = productRows(fixture).length;

    pickFromMenu(fixture, 'حذف');
    clickByText(fixture, 'حذف', 'app-confirm-action-dialog');

    expect(productRows(fixture)).toHaveLength(before - 1);
    expect(fixture.nativeElement.querySelector('app-confirm-action-dialog')).toBeNull();
  });

  function clickByText(
    fixture: ReturnType<typeof render>,
    label: string,
    within = 'app-confirm-action-dialog',
  ): void {
    const host = fixture.nativeElement.querySelector(within) as HTMLElement;
    Array.from(host.querySelectorAll('button'))
      .find((button) => button.textContent?.trim() === label)!
      .click();
    fixture.detectChanges();
  }

  it('shows the name, status and address in the header', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('صيدلية الحياة');
    expect(text).toContain('نشط');
    expect(text).toContain('شارع الثورة');
  });

  it('shows the owner, the subscription and the activity log', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('أحمد عبدالله');
    expect(text).toContain('مميزة');
    expect(text).toContain('منذ يومين');
  });

  it('writes the renewal and added dates the way the frame does, "Oct 24, 2024"', () => {
    const element: HTMLElement = render().nativeElement;

    const dates = Array.from(element.querySelectorAll('[data-role="card-date"]')).map((date) =>
      date.textContent?.trim(),
    );
    expect(dates).toEqual(['Oct 24, 2024', 'Oct 24, 2024']);
  });

  it('puts the store QR card at the top of the side column, above the owner', () => {
    const element: HTMLElement = render().nativeElement;

    const card = element.querySelector('app-store-qr-card:first-child + app-place-owner-card');
    expect(card).not.toBeNull();
  });

  it('draws the QR card for the place public link and name', () => {
    const element: HTMLElement = render().nativeElement;
    const card = element.querySelector('app-store-qr-card') as HTMLElement;

    expect(card.querySelector('input')?.value).toBe('mapmob.app/store/alhayat-pharmacy');
    expect(card.querySelector('svg')?.getAttribute('aria-label')).toBe(
      'رمز QR لصفحة صيدلية الحياة',
    );
  });

  it('shows the switched-on delivery platforms right under the location card', () => {
    const element: HTMLElement = render().nativeElement;

    const card = element.querySelector('app-place-location-card + app-place-delivery-card');
    expect(card?.textContent).toContain('https://beeorder.sy/store/alhayat-pharma');
    expect(card?.textContent).not.toContain('طلبات');
  });

  it('shows the working hours and the contact channels', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('أوقات العمل');
    expect(text).toContain('10:00 AM - 10:00 PM');
    expect(text).toContain('https://facebook.com/alhayatpharmacy');
  });
  it('draws a placeholder page while the place loads', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        { provide: PlaceRepository, useValue: { getPlace: () => NEVER } },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });

  it('offers a retry when the place cannot be loaded', () => {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([]),
        {
          provide: PlaceRepository,
          useValue: { getPlace: () => throwError(() => new Error('تعذر تحميل المكان')) },
        },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[role="alert"]').textContent).toContain(
      'تعذر تحميل المكان',
    );
  });

  it('shows the promotional offers section with a card per offer', () => {
    const fixture = render();
    const text = fixture.nativeElement.textContent;

    expect(text).toContain('العروض الترويجية');
    expect(text).toContain('العروض الترويجية الحالية الخاصة بصيدلية الحياة');
    expect(text).toContain('خصم 20 % على جميع المنتجات');
    expect(fixture.nativeElement.querySelectorAll('app-offer-card').length).toBe(3);
  });

  it('shows the video gallery section', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('معرض الفيديوهات');
    expect(text).toContain('الفيديوهات التعريفية للمكان');
    expect(text).toContain('إضافة فيديو');
  });

  it('shows the products and services table', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('المنتجات و الخدمات');
    expect(text).toContain('بعض من المنتجات والخدمات التي يقدمها المكان.');
    expect(text).toContain('سيروم تحت العين');
    expect(text).toContain('200 ل.س');
  });
});

describe('PlaceDetail actions', () => {
  function render(repository: Partial<PlaceRepository>) {
    TestBed.configureTestingModule({
      providers: [
        provideRouter([{ path: 'admin/places', children: [] }]),
        {
          provide: PlaceRepository,
          useValue: { getPlace: () => of(createPlaceDetail()), ...repository },
        },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();
    return fixture;
  }

  function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement | undefined {
    return Array.from(element.querySelectorAll('button')).find(
      (button) => button.textContent?.trim() === label,
    );
  }

  function confirmDialog(fixture: { nativeElement: HTMLElement }): HTMLElement {
    return fixture.nativeElement.querySelector('app-confirm-action-dialog') as HTMLElement;
  }

  it('suspends the place once the dialog is confirmed', async () => {
    let saved = '';
    const fixture = render({
      setPlacesStatus: (ids, status) => {
        saved = `${ids.join(',')}|${status}`;
        return of(undefined);
      },
    });

    buttonNamed(fixture.nativeElement, 'إيقاف النشاط')?.click();
    fixture.detectChanges();
    buttonNamed(confirmDialog(fixture), 'إيقاف النشاط')?.click();
    await fixture.whenStable();

    expect(saved).toBe('place-1|suspended');
  });

  it('leaves the page for the list once the place is deleted', async () => {
    let deletedIds: readonly string[] = [];
    const fixture = render({
      deletePlaces: (ids) => {
        deletedIds = ids;
        return of(undefined);
      },
    });

    buttonNamed(fixture.nativeElement, 'حذف المكان')?.click();
    fixture.detectChanges();
    buttonNamed(confirmDialog(fixture), 'حذف المكان')?.click();
    await fixture.whenStable();

    expect(deletedIds).toEqual(['place-1']);
    expect(TestBed.inject(Router).url).toBe('/admin/places');
  });
});

describe('PlaceDetail edit links', () => {
  function render() {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        provideRouter([
          { path: 'admin/places/:id/edit', children: [] },
          { path: 'admin/places', children: [] },
          { path: 'admin/offers/new', children: [] },
        ]),
        { provide: PlaceRepository, useValue: { getPlace: () => of(createPlaceDetail()) } },
      ],
    });
    const fixture = TestBed.createComponent(PlaceDetail);
    fixture.componentRef.setInput('id', 'place-1');
    fixture.detectChanges();
    return fixture;
  }

  function editButtonOfCard(element: HTMLElement, heading: string): HTMLButtonElement {
    const card = Array.from(element.querySelectorAll('app-info-card')).find(
      (one) => one.querySelector('h2')?.textContent?.trim() === heading,
    );
    return card?.querySelector('button') as HTMLButtonElement;
  }

  const CARD_SECTIONS: readonly [string, string][] = [
    ['المعلومات الأساسية', 'basic-info'],
    ['معلومات المالك', 'basic-info'],
    ['الاشتراك', 'subscription'],
    ['أوقات العمل', 'working-hours'],
    ['معلومات التواصل', 'details'],
    ['الموقع', 'location'],
    ['منصات الطلب والتوصيل', 'delivery'],
  ];

  for (const [heading, section] of CARD_SECTIONS) {
    it(`opens the edit page at the ${section} section from the ${heading} card`, async () => {
      const fixture = render();

      editButtonOfCard(fixture.nativeElement, heading).click();
      await fixture.whenStable();

      expect(TestBed.inject(Router).url).toBe(`/admin/places/place-1/edit#${section}`);
    });
  }

  it('opens the edit page at the media section from the gallery', async () => {
    const fixture = render();

    (fixture.nativeElement.querySelector('[data-testid="add-image"]') as HTMLElement).click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/admin/places/place-1/edit#media');
  });

  it('opens the edit page at the media section from the videos card', async () => {
    const fixture = render();

    buttonNamedIn(fixture.nativeElement, 'إضافة فيديو').click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/admin/places/place-1/edit#media');
  });

  it('adds a product through the dialog, without leaving the page', async () => {
    const fixture = render();
    const before = productRows(fixture).length;

    buttonNamedIn(fixture.nativeElement, 'إضافة منتج أو خدمة').click();
    await fixture.whenStable();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('إضافة منتج أو خدمة');
    expect(TestBed.inject(Router).url).toBe('/');

    typeIntoDialog(fixture, 'product-name', 'كريم مرطب');
    typeIntoDialog(fixture, 'product-price', '350');
    (fixture.nativeElement.querySelector('[data-testid="submit-product"]') as HTMLElement).click();
    fixture.detectChanges();

    const rows = productRows(fixture);
    expect(rows).toHaveLength(before + 1);
    expect(rows.at(-1)?.textContent).toContain('كريم مرطب');
  });

  function typeIntoDialog(fixture: ReturnType<typeof render>, testId: string, value: string): void {
    const field: HTMLInputElement = fixture.nativeElement.querySelector(
      `[data-testid="${testId}"]`,
    );
    field.value = value;
    field.dispatchEvent(new Event('input'));
    fixture.detectChanges();
  }

  it('opens the offer form when a promotional offer is added', async () => {
    const fixture = render();

    buttonNamedIn(fixture.nativeElement, 'إضافة عرض').click();
    await fixture.whenStable();

    expect(TestBed.inject(Router).url).toBe('/admin/offers/new');
  });

  it('opens the product dialog when a product name is clicked', async () => {
    const fixture = render();

    (fixture.nativeElement.querySelector('[data-role="open-product"]') as HTMLElement).click();
    await fixture.whenStable();
    fixture.detectChanges();

    const name: HTMLInputElement = fixture.nativeElement.querySelector(
      '[data-testid="product-name"]',
    );
    expect(name.value).toBe('سيروم تحت العين');
    expect(TestBed.inject(Router).url).toBe('/');
  });
});

function productRows(fixture: ComponentFixture<PlaceDetail>): HTMLElement[] {
  return Array.from(fixture.nativeElement.querySelectorAll('app-place-products-card tbody tr'));
}

function buttonNamedIn(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}
