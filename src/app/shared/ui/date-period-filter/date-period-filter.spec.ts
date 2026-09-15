import { TestBed } from '@angular/core/testing';
import { DatePeriod } from '../../models/date-period';
import { DateRange } from '../../models/date-range';
import { DatePeriodFilter } from './date-period-filter';

interface RenderOptions {
  readonly period?: DatePeriod;
  readonly customRange?: DateRange;
  readonly headingIcon?: string | null;
  readonly hasFixedWidthFields?: boolean;
}

function render(options: RenderOptions = {}) {
  const fixture = TestBed.createComponent(DatePeriodFilter);
  fixture.componentRef.setInput('heading', 'الفترة الزمنية');
  fixture.componentRef.setInput('period', options.period ?? 'all');
  fixture.componentRef.setInput('customRange', options.customRange ?? { from: null, to: null });
  if (options.headingIcon !== undefined) {
    fixture.componentRef.setInput('headingIcon', options.headingIcon);
  }
  if (options.hasFixedWidthFields !== undefined) {
    fixture.componentRef.setInput('hasFixedWidthFields', options.hasFixedWidthFields);
  }
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('DatePeriodFilter', () => {
  it('shows the given heading, with or without its icon', () => {
    const plain = render({ headingIcon: null }).nativeElement as HTMLElement;
    const withIcon = render({ headingIcon: 'calendar-outline' }).nativeElement as HTMLElement;

    expect(plain.textContent).toContain('الفترة الزمنية');
    expect(plain.querySelector('app-icon')).toBeNull();
    expect(withIcon.querySelector('app-icon')).toBeTruthy();
  });

  it('marks the picked preset and reports a new pick', () => {
    const fixture = render({ period: 'today' });
    const periodChange = vi.fn();
    fixture.componentInstance.periodChange.subscribe(periodChange);
    const element = fixture.nativeElement as HTMLElement;

    expect(buttonNamed(element, 'اليوم').getAttribute('aria-pressed')).toBe('true');
    buttonNamed(element, 'آخر 30 يوم').click();

    expect(periodChange).toHaveBeenCalledWith('last30Days');
  });

  it('opens the custom range with a summary and reports each end', () => {
    const fixture = render({
      period: 'custom',
      customRange: { from: '2026-08-01', to: '2026-09-02' },
    });
    const customRangeChange = vi.fn();
    fixture.componentInstance.customRangeChange.subscribe(customRangeChange);
    const element = fixture.nativeElement as HTMLElement;
    const [, toInput] = Array.from(
      element.querySelectorAll('[data-testid="custom-range"] input'),
    ) as HTMLInputElement[];

    toInput.value = '2026-09-10';
    toInput.dispatchEvent(new Event('change'));

    expect(element.textContent).toContain('تم تحديد فترة 33 يوماً في شهر أغسطس وسبتمبر');
    expect(customRangeChange).toHaveBeenCalledWith({ from: '2026-08-01', to: '2026-09-10' });
  });

  it('can keep the two date fields at their fixed design width', () => {
    const element = render({ period: 'custom', hasFixedWidthFields: true })
      .nativeElement as HTMLElement;

    const fields = Array.from(element.querySelectorAll('app-date-field'));
    expect(fields.every((field) => field.classList.contains('w-[114px]'))).toBe(true);
  });
});
