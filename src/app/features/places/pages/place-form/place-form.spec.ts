import { provideRouter } from '@angular/router';
import { TestBed } from '@angular/core/testing';
import { PlaceForm } from './place-form';

function render(id: string | undefined = '') {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(PlaceForm);
  fixture.componentRef.setInput('id', id);
  fixture.detectChanges();
  return fixture;
}

describe('PlaceForm', () => {
  it('renders all six sections of the design', () => {
    const text = render().nativeElement.textContent;

    for (const heading of [
      'المعلومات الأساسية',
      'موقع المكان',
      'تفاصيل المكان',
      'أوقات العمل',
      'الخدمات والصور',
      'الباقة والحالة',
    ]) {
      expect(text).toContain(heading);
    }
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

  it('starts with the week and the default services filled in', () => {
    const fixture = render();

    expect(fixture.nativeElement.querySelectorAll('button[role="switch"]').length).toBe(7);
    expect(fixture.nativeElement.textContent).toContain('مواقف سيارات');
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
    const form = fixture.nativeElement.querySelector('form') as HTMLFormElement;
    form.dispatchEvent(new Event('submit'));
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('تم حفظ المكان بنجاح');
    expect(text).toContain('تمت إضافة المكان بنجاح وسيظهر في قائمة الشركات والمتاجر.');
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
