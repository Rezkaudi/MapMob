import { TestBed } from '@angular/core/testing';
import { CurrencySettings } from '../../models/currency-settings';
import { CurrencySettingsCard } from './currency-settings-card';

function render() {
  const fixture = TestBed.createComponent(CurrencySettingsCard);
  fixture.componentRef.setInput('currency', {
    currency: 'SYP',
    currencySymbol: 'ل.س',
    decimalPlaces: 0,
  });
  const saved: CurrencySettings[] = [];
  fixture.componentInstance.saved.subscribe((currency) => saved.push(currency));
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, saved };
}

function optionLabels(element: HTMLElement, id: string): (string | undefined)[] {
  const select = element.querySelector(`#${id}`) as HTMLSelectElement;
  return Array.from(select.options).map((option) => option.textContent?.trim());
}

describe('CurrencySettingsCard', () => {
  it('offers the currencies and decimal places with an example of each', () => {
    const { element } = render();

    expect(optionLabels(element, 'default-currency')).toEqual([
      'الليرة السورية (ل.س / SYP)',
      'الدولار الأمريكي ($ / USD)',
    ]);
    expect(optionLabels(element, 'decimal-places')).toEqual([
      '0 مثال (1500)',
      '1 مثال (1500.0)',
      '2 مثال (1500.00)',
    ]);
    expect((element.querySelector('#currency-symbol') as HTMLInputElement).value).toBe('ل.س');
  });

  it('saves the decimal places as a number', () => {
    const { element, saved } = render();
    const decimals = element.querySelector('#decimal-places') as HTMLSelectElement;

    decimals.value = decimals.options[2].value;
    decimals.dispatchEvent(new Event('change'));
    (element.querySelector('button[type="submit"]') as HTMLButtonElement).click();

    expect(saved).toEqual([{ currency: 'SYP', currencySymbol: 'ل.س', decimalPlaces: 2 }]);
  });
});
