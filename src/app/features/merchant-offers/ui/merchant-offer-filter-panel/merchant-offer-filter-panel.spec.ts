import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DatePeriodFilter } from '../../../../shared/ui/date-period-filter/date-period-filter';
import { FilterPopover } from '../../../../shared/ui/filter-popover/filter-popover';
import {
  MerchantOfferFilters,
  NO_MERCHANT_OFFER_FILTERS,
} from '../../models/merchant-offer-filters';
import { MerchantOfferFilterPanel } from './merchant-offer-filter-panel';

function build(filters: MerchantOfferFilters = NO_MERCHANT_OFFER_FILTERS) {
  const fixture = TestBed.createComponent(MerchantOfferFilterPanel);
  fixture.componentRef.setInput('filters', filters);
  fixture.detectChanges();
  const applied: MerchantOfferFilters[] = [];
  fixture.componentInstance.applied.subscribe((value) => applied.push(value));
  return { fixture, host: fixture.nativeElement as HTMLElement, applied };
}

function chips(host: HTMLElement): HTMLButtonElement[] {
  return [...host.querySelectorAll<HTMLButtonElement>('[role="radiogroup"] button')];
}

function buttonNamed(host: HTMLElement, label: string): HTMLButtonElement {
  return [...host.querySelectorAll('button')].find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('MerchantOfferFilterPanel', () => {
  it('is the plain-headed "تصفية العروض" popover', () => {
    const { fixture } = build();
    const popover = fixture.debugElement.query(By.directive(FilterPopover))
      .componentInstance as FilterPopover;

    expect(popover.heading()).toBe('تصفية العروض');
    expect(popover.headerAppearance()).toBe('plain');
  });

  it('lists four statuses, right to left, with no "الكل" chip', () => {
    expect(chips(build().host).map((chip) => chip.textContent?.trim())).toEqual([
      'نشط',
      'قادم',
      'متوقف',
      'منتهي',
    ]);
  });

  it('picks a status, and a second press on the same chip clears it', () => {
    const { fixture, host, applied } = build();

    chips(host)[1].click();
    fixture.detectChanges();
    expect(chips(host)[1].getAttribute('aria-checked')).toBe('true');
    chips(host)[1].click();
    fixture.detectChanges();
    buttonNamed(host, 'تطبيق الفلاتر').click();

    expect(applied[0].status).toBeNull();
  });

  it('applies the picked status, scope and period together', () => {
    const { fixture, host, applied } = build();

    chips(host)[0].click();
    const scope = host.querySelector('select') as HTMLSelectElement;
    scope.value = 'selectedItems';
    scope.dispatchEvent(new Event('change'));
    buttonNamed(host, 'آخر 7 أيام').click();
    fixture.detectChanges();
    buttonNamed(host, 'تطبيق الفلاتر').click();

    expect(applied).toEqual([
      {
        ...NO_MERCHANT_OFFER_FILTERS,
        status: 'active',
        scope: 'selectedItems',
        period: 'last7Days',
      },
    ]);
  });

  it('names the scope choices and shows the applied one', () => {
    const { host } = build({ ...NO_MERCHANT_OFFER_FILTERS, scope: 'allItems' });
    const select = host.querySelector('select') as HTMLSelectElement;

    expect([...select.options].map((option) => option.textContent?.trim())).toEqual([
      'الكل',
      'جميع المنتجات/الخدمات',
      'منتجات وخدمات محددة',
    ]);
    expect(select.value).toBe('allItems');
  });

  it('holds "تطبيق الفلاتر" until a custom period has both days in order', () => {
    const { fixture, host } = build({ ...NO_MERCHANT_OFFER_FILTERS, period: 'custom' });
    const period = fixture.debugElement.query(By.directive(DatePeriodFilter))
      .componentInstance as DatePeriodFilter;
    expect(period.hasFixedWidthFields()).toBe(true);
    expect(buttonNamed(host, 'تطبيق الفلاتر').disabled).toBe(true);

    period.customRangeChange.emit({ from: '2026-08-01', to: '2026-09-02' });
    fixture.detectChanges();

    expect(buttonNamed(host, 'تطبيق الفلاتر').disabled).toBe(false);
  });

  it('clears everything on "إعادة ضبط"', () => {
    const { host, applied } = build({ ...NO_MERCHANT_OFFER_FILTERS, status: 'expired' });

    buttonNamed(host, 'إعادة ضبط').click();

    expect(applied).toEqual([NO_MERCHANT_OFFER_FILTERS]);
  });
});
