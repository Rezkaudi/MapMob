import { TestBed } from '@angular/core/testing';
import { NO_PAYMENT_FILTERS } from '../../models/payment-filters';
import { PaymentToolbar } from './payment-toolbar';

function render() {
  const fixture = TestBed.createComponent(PaymentToolbar);
  fixture.componentRef.setInput('filters', NO_PAYMENT_FILTERS);
  fixture.detectChanges();
  return fixture;
}

describe('PaymentToolbar', () => {
  it('searches for a company/place and keeps sort and "الفلاتر" 8px apart', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('input')?.getAttribute('placeholder')).toBe(
      'ابحث عن شركة /متجر..',
    );
    expect((element.querySelector('app-sort-select')?.parentElement as HTMLElement).style.gap).toBe(
      '8px',
    );
  });

  it('opens the payment filter panel and passes an applied filter on, closing the panel', () => {
    const fixture = render();
    const filtersApply = vi.fn();
    fixture.componentInstance.filtersApply.subscribe(filtersApply);
    const element = fixture.nativeElement as HTMLElement;
    const filterButton = element.querySelector('button[aria-controls]') as HTMLButtonElement;

    filterButton.click();
    fixture.detectChanges();
    const applyButton = Array.from(
      element.querySelectorAll('app-payment-filter-panel button'),
    ).find((button) => button.textContent?.trim() === 'تطبيق الفلاتر') as HTMLButtonElement;
    applyButton.click();
    fixture.detectChanges();

    expect(filtersApply).toHaveBeenCalledWith(NO_PAYMENT_FILTERS);
    expect(element.querySelector('app-payment-filter-panel')).toBeNull();
  });
});
