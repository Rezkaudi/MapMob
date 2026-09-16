import { TestBed } from '@angular/core/testing';
import { DateRange } from '../../../../shared/models/date-range';
import { OfferPeriodFields } from './offer-period-fields';

function render(range: DateRange) {
  const fixture = TestBed.createComponent(OfferPeriodFields);
  fixture.componentRef.setInput('range', range);
  fixture.detectChanges();
  return fixture;
}

describe('OfferPeriodFields', () => {
  it('writes "من" before the first day and "إلى" before the last, in 40px boxes', () => {
    const element = render({ from: '2026-08-01', to: '2026-08-31' }).nativeElement as HTMLElement;

    expect(
      Array.from(element.querySelectorAll('[data-role="period-word"]'), (word) =>
        word.textContent?.trim(),
      ),
    ).toEqual(['من', 'إلى']);
    expect(
      Array.from(element.querySelectorAll('input'), (input) => input.getAttribute('aria-label')),
    ).toEqual(['تاريخ بداية العرض', 'تاريخ انتهاء العرض']);
    expect(element.querySelector('[data-role="date-box"]')?.className).toContain('h-10');
  });

  it('emits the whole range when a day changes', () => {
    const fixture = render({ from: '2026-08-01', to: null });
    const changed = vi.fn();
    fixture.componentInstance.rangeChange.subscribe(changed);
    const [, last] = Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('input'));

    last.value = '2026-08-20';
    last.dispatchEvent(new Event('change'));

    expect(changed).toHaveBeenCalledWith({ from: '2026-08-01', to: '2026-08-20' });
  });
});
