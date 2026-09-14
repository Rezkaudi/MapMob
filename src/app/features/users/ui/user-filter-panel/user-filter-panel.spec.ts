import { TestBed } from '@angular/core/testing';
import { NO_USER_FILTERS, UserFilters } from '../../models/user-filters';
import { UserFilterPanel } from './user-filter-panel';

function render(filters: UserFilters = NO_USER_FILTERS) {
  const fixture = TestBed.createComponent(UserFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function radioNamed(element: HTMLElement, group: string, label: string): HTMLButtonElement {
  const radioGroup = element.querySelector(
    `[role="radiogroup"][aria-label="${group}"]`,
  ) as HTMLElement;
  return buttonNamed(radioGroup, label);
}

describe('UserFilterPanel', () => {
  it('shows the heading, the three groups and the footer actions', () => {
    const text = (render().nativeElement as HTMLElement).textContent;

    for (const words of [
      'تصفية المستخدمين',
      'تطبيق معايير متعددة لتخصيص نتائج البحث',
      'نوع الحساب',
      'حالة الحساب',
      'تاريخ التسجيل',
      'إعادة ضبط',
      'تطبيق الفلاتر',
    ]) {
      expect(text).toContain(words);
    }
  });

  it('applies only when asked, with everything picked in the panel', () => {
    const fixture = render();
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    radioNamed(element, 'نوع الحساب', 'مسجل').click();
    radioNamed(element, 'حالة الحساب', 'موقوف').click();
    buttonNamed(element, 'آخر 7 أيام').click();
    fixture.detectChanges();
    expect(applied).not.toHaveBeenCalled();
    buttonNamed(element, 'تطبيق الفلاتر').click();

    expect(applied).toHaveBeenCalledWith({
      accountType: 'registered',
      status: 'suspended',
      registrationPeriod: 'last7Days',
      customRange: { from: null, to: null },
    });
  });

  it('opens the custom range only for "نطاق مخصص", and holds apply until the range is whole', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;
    expect(element.querySelector('[data-testid="custom-range"]')).toBeNull();

    buttonNamed(element, 'نطاق مخصص').click();
    fixture.detectChanges();
    const [fromInput, toInput] = Array.from(
      element.querySelectorAll('[data-testid="custom-range"] input'),
    ) as HTMLInputElement[];
    expect(buttonNamed(element, 'تطبيق الفلاتر').disabled).toBe(true);

    fromInput.value = '2026-08-01';
    fromInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();
    toInput.value = '2026-09-02';
    toInput.dispatchEvent(new Event('change'));
    fixture.detectChanges();

    expect(element.textContent).toContain('تم تحديد فترة 33 يوماً في شهر أغسطس وسبتمبر');
    expect(buttonNamed(element, 'تطبيق الفلاتر').disabled).toBe(false);
  });

  it('starts from the applied filters', () => {
    const element = render({
      ...NO_USER_FILTERS,
      status: 'active',
      registrationPeriod: 'custom',
      customRange: { from: '2026-08-01', to: '2026-09-02' },
    }).nativeElement as HTMLElement;

    expect(radioNamed(element, 'حالة الحساب', 'نشط').getAttribute('aria-checked')).toBe('true');
    expect(element.querySelector('[data-testid="custom-range"]')).toBeTruthy();
  });

  it('resets every group to "الكل" and applies that at once', () => {
    const fixture = render({
      ...NO_USER_FILTERS,
      accountType: 'visitor',
      registrationPeriod: 'today',
    });
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'إعادة ضبط').click();
    fixture.detectChanges();

    expect(applied).toHaveBeenCalledWith(NO_USER_FILTERS);
    expect(radioNamed(element, 'نوع الحساب', 'الكل').getAttribute('aria-checked')).toBe('true');
  });

  it('closes from the cross', () => {
    const fixture = render();
    const closed = vi.fn();
    fixture.componentInstance.closed.subscribe(closed);

    (
      fixture.nativeElement.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement
    ).click();

    expect(closed).toHaveBeenCalledOnce();
  });
});
