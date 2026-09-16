import { TestBed } from '@angular/core/testing';
import { DateRange } from '../../models/date-range';
import { DateRangeFields } from './date-range-fields';

function render(range: DateRange) {
  const fixture = TestBed.createComponent(DateRangeFields);
  fixture.componentRef.setInput('range', range);
  fixture.detectChanges();
  return fixture;
}

function dateInputs(fixture: ReturnType<typeof render>): HTMLInputElement[] {
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('input[type="date"]'));
}

describe('DateRangeFields', () => {
  it('shows both days and describes the range under them', () => {
    const fixture = render({ from: '2026-08-01', to: '2026-09-02' });
    const text = (fixture.nativeElement as HTMLElement).textContent ?? '';

    expect(text).toContain('من تاريخ');
    expect(text).toContain('إلى تاريخ');
    expect(text).toContain('تم تحديد فترة 33 يوماً في شهر أغسطس وسبتمبر');
  });

  it('asks for both ends while the range is not complete', () => {
    expect((render({ from: null, to: null }).nativeElement as HTMLElement).textContent).toContain(
      'اختر بداية الفترة ونهايتها',
    );
  });

  it('keeps each end inside the other and emits the whole range on a change', () => {
    const fixture = render({ from: '2026-08-01', to: '2026-09-02' });
    const changed = vi.fn();
    fixture.componentInstance.rangeChange.subscribe(changed);
    const [from, to] = dateInputs(fixture);

    expect(from.max).toBe('2026-09-02');
    expect(to.min).toBe('2026-08-01');

    to.value = '2026-09-10';
    to.dispatchEvent(new Event('change'));

    expect(changed).toHaveBeenCalledWith({ from: '2026-08-01', to: '2026-09-10' });
  });
});
