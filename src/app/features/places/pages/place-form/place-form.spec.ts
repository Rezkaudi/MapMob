import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';
import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { MediaPicker } from '../../../../shared/ui/media-picker/media-picker';
import { PlaceRepository } from '../../data/place.repository';
import { PlaceDetail } from '../../models/place-detail';
import { createPlaceDetail } from '../../testing/place-detail-fixture';
import { PlaceForm } from './place-form';

function render(id: string | undefined = '', getPlace?: (id: string) => Observable<PlaceDetail>) {
  TestBed.resetTestingModule();
  const repository: Partial<PlaceRepository> = {
    getPlace: getPlace ?? ((placeId) => of(createPlaceDetail({ id: placeId }))),
  };
  TestBed.configureTestingModule({
    providers: [provideRouter([]), { provide: PlaceRepository, useValue: repository }],
  });
  const fixture = TestBed.createComponent(PlaceForm);
  fixture.componentRef.setInput('id', id);
  fixture.detectChanges();
  return fixture;
}

function fieldValue(fixture: ReturnType<typeof render>, selector: string): string {
  return (fixture.nativeElement.querySelector(selector) as HTMLInputElement).value;
}

const REQUIRED_VALUES = {
  name: 'صيدلية الحياة',
  ownerPhone: '0955000000',
  mainCategory: 'صيدلية',
  city: 'الرياض',
  region: 'المركز',
  address: 'شارع الثورة',
  phone: '0955111111',
};

function fillRequiredFields(fixture: ReturnType<typeof render>): void {
  fixture.componentInstance['form'].patchValue(REQUIRED_VALUES);
  fixture.detectChanges();
}

function submit(fixture: ReturnType<typeof render>): void {
  const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
  form.dispatchEvent(new Event('submit'));
  fixture.detectChanges();
}

describe('PlaceForm', () => {
  it('renders the six sections of the design, in its order', () => {
    const headings: HTMLElement[] = Array.from(
      render().nativeElement.querySelectorAll('app-form-section h2, app-form-section h3'),
    );

    expect(headings.map((heading) => heading.textContent?.trim())).toEqual([
      'المعلومات الأساسية',
      'موقع المكان',
      'تفاصيل المكان',
      'أوقات العمل',
      'الباقة والحالة',
      'معرض الصور و الفيديوهات',
      'المنتجات والخدمات',
    ]);
  });

  it('counts the gallery against what the package allows', () => {
    const badges: HTMLElement[] = Array.from(
      render().nativeElement.querySelectorAll('app-package-quota-badge'),
    );

    expect(badges).toHaveLength(3);
    expect(badges[0].textContent).toContain('0 / 3 صور');
    expect(badges[1].textContent).toContain('0 / 1 فيديو');
    expect(badges[2].textContent).toContain('0 / 3 منتجات وخدمات');
  });

  it('titles itself "إضافة مكان جديد" when adding and "تعديل المكان" when editing', () => {
    expect(render().nativeElement.querySelector('h1').textContent.trim()).toBe('إضافة مكان جديد');
    // The add route binds no :id at all, so the input arrives undefined.
    expect(render(undefined).nativeElement.querySelector('h1').textContent.trim()).toBe(
      'إضافة مكان جديد',
    );
    expect(render('place-1').nativeElement.querySelector('h1').textContent.trim()).toBe(
      'تعديل المكان',
    );
  });

  it('shows the three footer actions', () => {
    const text = render().nativeElement.textContent;

    expect(text).toContain('حفظ المكان');
    expect(text).toContain('حفظ كمسودة');
    expect(text).toContain('إلغاء');
  });

  it('runs the action bar as the frame reads it, left to right', () => {
    const actions: HTMLElement[] = Array.from(
      render().nativeElement.querySelectorAll('[data-testid="form-actions"] > *'),
    );

    // RTL packs them left and the first child lands rightmost, so this list is back to front.
    expect(actions.map((action) => action.textContent?.trim())).toEqual([
      'حفظ المكان',
      'حفظ كمسودة',
      'إلغاء',
    ]);
  });

  it('holds each gallery picker to what the package allows', () => {
    const pickers = render()
      .debugElement.queryAll(By.directive(MediaPicker))
      .map((picker) => picker.componentInstance as MediaPicker);

    expect(pickers.map((picker) => picker.limit())).toEqual([3, 1]);
    expect(pickers.map((picker) => picker.noun())).toEqual(['صور', 'فيديو']);
  });

  it('starts with a full week of opening hours', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelectorAll('button[role="switch"]').length).toBe(7);
  });

  it('"مفتوح 24 ساعة" opens every day of the week', () => {
    const fixture = render();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.includes('مفتوح 24 ساعة'))?.click();
    fixture.detectChanges();

    const switches: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button[role="switch"]'),
    );
    expect(switches.every((toggle) => toggle.getAttribute('aria-checked') === 'true')).toBe(true);
  });

  it('confirms with a toast once the place is saved', () => {
    const fixture = render();
    fillRequiredFields(fixture);
    submit(fixture);

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('تم حفظ المكان بنجاح');
    expect(text).toContain('تمت إضافة المكان بنجاح وسيظهر في قائمة الشركات والمتاجر.');
  });

  it('does not claim the place was saved while required fields are empty', () => {
    const fixture = render();
    submit(fixture);

    expect(fixture.nativeElement.textContent).not.toContain('تم حفظ المكان بنجاح');
  });

  it('marks the empty fields so the form says what is missing', () => {
    const fixture = render();
    submit(fixture);

    expect(fixture.componentInstance['form'].controls.name.touched).toBe(true);
  });

  it('adds the products section and follows the package limit when the package changes', () => {
    const fixture = render();
    expect(fixture.nativeElement.textContent).toContain('المنتجات والخدمات');
    expect(fixture.nativeElement.textContent).toContain('0 / 3 منتجات وخدمات');

    const packageField: HTMLSelectElement = fixture.nativeElement.querySelector('select#package');
    packageField.value = 'premium';
    packageField.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('0 / 50 منتجات وخدمات');
    expect(fixture.nativeElement.textContent).toContain('مميزة');
  });

  it('keeps a product added through the dialog', () => {
    const fixture = render();
    (fixture.nativeElement.querySelector('[data-testid="add-product"]') as HTMLElement).click();
    fixture.detectChanges();

    const setValue = (testId: string, value: string) => {
      const field: HTMLInputElement = fixture.nativeElement.querySelector(
        `[data-testid="${testId}"]`,
      );
      field.value = value;
      field.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    };
    setValue('product-name', 'تنظيف بشرة عميق');
    setValue('product-price', '150');
    (fixture.nativeElement.querySelector('[data-testid="submit-product"]') as HTMLElement).click();
    fixture.detectChanges();

    expect(
      fixture.nativeElement.querySelector('[data-testid="product-item"]').textContent,
    ).toContain('تنظيف بشرة عميق');
    expect(fixture.nativeElement.textContent).toContain('1 / 3 منتجات وخدمات');
  });

  it('fills every field with the saved place when editing', () => {
    const fixture = render('place-1');
    const detail = createPlaceDetail();

    expect(fieldValue(fixture, 'input#place-name')).toBe(detail.name);
    expect(fieldValue(fixture, 'input#owner-name')).toBe(detail.owner.name);
    expect(fieldValue(fixture, 'input#owner-phone')).toBe(detail.owner.phone);
    expect(fieldValue(fixture, 'input#owner-extra-phone')).toBe(detail.owner.extraPhone);
    expect(fieldValue(fixture, 'select#main-category')).toBe(detail.mainCategory);
    expect(fieldValue(fixture, 'input#sub-category')).toBe(detail.subCategory);
    expect(fieldValue(fixture, 'select#city')).toBe(detail.location.city);
    expect(fieldValue(fixture, 'select#region')).toBe(detail.location.region);
    expect(fieldValue(fixture, 'input#address')).toBe(detail.location.address);
    expect(fieldValue(fixture, 'input#phone')).toBe(detail.contact.phone);
    expect(fieldValue(fixture, 'input#extra-phone')).toBe(detail.contact.extraPhone);
    expect(fieldValue(fixture, 'input#website')).toBe(detail.contact.website);
    expect(fieldValue(fixture, 'input#whatsapp')).toBe(detail.contact.whatsapp);
    expect(fieldValue(fixture, 'input#facebook')).toBe(detail.contact.facebook);
    expect(fieldValue(fixture, 'input#instagram')).toBe(detail.contact.instagram);
    expect(fieldValue(fixture, 'input#telegram')).toBe(detail.contact.telegram);
    expect(fieldValue(fixture, 'textarea#description')).toBe(detail.description);
    expect(fieldValue(fixture, 'select#package')).toBe(detail.subscription.package);
    expect(fieldValue(fixture, 'select#status')).toBe(detail.status);
  });

  it('shows the saved gallery, videos and products when editing', () => {
    const fixture = render('place-1');
    const detail = createPlaceDetail();

    const pickers = fixture.debugElement
      .queryAll(By.directive(MediaPicker))
      .map((picker) => picker.componentInstance as MediaPicker);
    expect(pickers[0].files().map((file) => file.previewUrl)).toEqual(detail.images);
    expect(pickers[1].files()).toHaveLength(detail.videos.length);
    expect(fixture.nativeElement.querySelectorAll('[data-testid="product-item"]')).toHaveLength(
      detail.products.length,
    );
  });

  it('opens the days the saved place works on', () => {
    const fixture = render('place-1');

    const switches: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button[role="switch"]'),
    );
    // The fixture opens السبت and الأحد - الخميس, and leaves الجمعة closed.
    expect(switches.map((toggle) => toggle.getAttribute('aria-checked'))).toEqual([
      'true',
      'true',
      'true',
      'true',
      'true',
      'true',
      'false',
    ]);
  });

  it('leaves the form empty when adding', () => {
    expect(fieldValue(render(), 'input#place-name')).toBe('');
  });

  it('offers to load the place again when it fails', () => {
    let calls = 0;
    const fixture = render('place-1', (placeId) =>
      ++calls === 1
        ? throwError(() => new Error('تعذر تحميل المكان'))
        : of(createPlaceDetail({ id: placeId })),
    );

    expect(fixture.nativeElement.textContent).toContain('تعذر تحميل المكان');
    expect(fixture.nativeElement.querySelector('form')).toBeNull();

    (fixture.nativeElement.querySelector('app-error-state button') as HTMLButtonElement).click();
    fixture.detectChanges();

    expect(fieldValue(fixture, 'input#place-name')).toBe('صيدلية الحياة');
  });

  it('keeps the save bar above the map', () => {
    const fixture = render();
    const mapBox: HTMLElement = fixture.nativeElement.querySelector('[data-testid="map-box"]');
    const saveBar: HTMLElement = fixture.nativeElement.querySelector(
      '[data-testid="form-actions"]',
    );

    // Leaflet paints its panes at z-index 400 and its controls at 1000, so the map
    // has to be its own stacking context or it covers the bar.
    expect(mapBox.className).toContain('isolate');
    expect(saveBar.className).toContain('z-30');
  });
});
