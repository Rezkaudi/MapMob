import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { CurrencyCode } from '../../../../shared/money/currency-code';
import { PriceCycleCard } from './price-cycle-card';

function build(currency: CurrencyCode = 'SYP') {
  const fixture = TestBed.createComponent(PriceCycleCard);
  fixture.componentRef.setInput('tone', 'monthly');
  fixture.componentRef.setInput('title', 'الاشتراك الشهري');
  fixture.componentRef.setInput('badge', 'شهري');
  fixture.componentRef.setInput('priceLabel', 'قيمة الاشتراك الشهري');
  fixture.componentRef.setInput('currency', currency);
  fixture.componentRef.setInput('control', new FormControl<number | null>(20));
  fixture.detectChanges();
  return fixture;
}

describe('PriceCycleCard', () => {
  it('shows the sign of the currency the plan is priced in', () => {
    expect((build('USD').nativeElement as HTMLElement).textContent).toContain('$');
    expect((build('SYP').nativeElement as HTMLElement).textContent).toContain('ل.س');
  });

  it('reports the currency the admin picks', () => {
    const fixture = build();
    const picked: CurrencyCode[] = [];
    fixture.componentInstance.currencyChange.subscribe((code) => picked.push(code));

    const select: HTMLSelectElement = fixture.nativeElement.querySelector(
      '[data-testid="currency-select"]',
    );
    select.value = 'USD';
    select.dispatchEvent(new Event('change'));

    expect(picked).toEqual(['USD']);
  });

  it('writes a typed price into the control, never below zero', () => {
    const fixture = build();
    const control = fixture.componentInstance.control();
    const price: HTMLInputElement = fixture.nativeElement.querySelector('input[type="number"]');

    price.value = '-5';
    price.dispatchEvent(new Event('input'));
    expect(control.value).toBe(0);

    price.value = '';
    price.dispatchEvent(new Event('input'));
    expect(control.value).toBeNull();
  });

  it('sends a click on the caption to the price, not to the currency list', () => {
    const fixture = build();
    const element = fixture.nativeElement as HTMLElement;
    const select: HTMLSelectElement = element.querySelector('[data-testid="currency-select"]')!;
    const price: HTMLInputElement = element.querySelector('input[type="number"]')!;

    expect(select.labels).toHaveLength(0);
    expect(price.labels).toHaveLength(1);
  });
});
