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
});
