import { TestBed } from '@angular/core/testing';
import { NO_OFFER_FILTERS, OfferFilters } from '../../models/offer-filters';
import { OfferFilterPanel } from './offer-filter-panel';

function render(filters: OfferFilters = NO_OFFER_FILTERS) {
  const fixture = TestBed.createComponent(OfferFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

function changeDay(element: HTMLElement, label: string, day: string): void {
  const input = element.querySelector(`input[aria-label="${label}"]`) as HTMLInputElement;
  input.value = day;
  input.dispatchEvent(new Event('change'));
}

describe('OfferFilterPanel', () => {
  it('shows the heading, the status chips, the offer days and the footer actions', () => {
    const element = render().nativeElement as HTMLElement;
    const chips = Array.from(element.querySelectorAll('[role="radio"]'), (chip) =>
      chip.textContent?.trim(),
    );

    expect(element.textContent).toContain('تصفية العروض');
    expect(element.textContent).toContain('تاريخ العرض');
    expect(chips).toEqual(['الكل', 'نشط', 'مسودة', 'قادم', 'منتهي', 'متوقف']);
    expect(buttonNamed(element, 'إعادة ضبط')).toBeTruthy();
  });

  it('applies only when asked, with everything picked in the panel', () => {
    const fixture = render();
    const applied = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'قادم').click();
    fixture.detectChanges();
    changeDay(element, 'من تاريخ', '2026-08-01');
    fixture.detectChanges();
    changeDay(element, 'إلى تاريخ', '2026-09-02');
    fixture.detectChanges();
    expect(applied).not.toHaveBeenCalled();

    buttonNamed(element, 'تطبيق الفلاتر').click();

    expect(applied).toHaveBeenCalledWith({
      status: 'scheduled',
      runningRange: { from: '2026-08-01', to: '2026-09-02' },
    });
  });

  it('will not apply a range that ends before it starts', () => {
    const fixture = render({
      status: null,
      runningRange: { from: '2026-09-10', to: '2026-09-01' },
    });

    expect(buttonNamed(fixture.nativeElement, 'تطبيق الفلاتر').disabled).toBe(true);
  });

  it('resets to "الكل" and applies that straight away, and closes from the cross', () => {
    const fixture = render({ status: 'paused', runningRange: { from: '2026-09-01', to: null } });
    const applied = vi.fn();
    const closed = vi.fn();
    fixture.componentInstance.applied.subscribe(applied);
    fixture.componentInstance.closed.subscribe(closed);
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'إعادة ضبط').click();
    (element.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement).click();

    expect(applied).toHaveBeenCalledWith(NO_OFFER_FILTERS);
    expect(closed).toHaveBeenCalled();
  });
});
