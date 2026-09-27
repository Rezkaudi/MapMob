import { TestBed } from '@angular/core/testing';
import { CurrencyCode } from '../../money/currency-code';
import { CurrencySelect } from './currency-select';

function buildSelect(currency: CurrencyCode = 'SYP') {
  const fixture = TestBed.createComponent(CurrencySelect);
  fixture.componentRef.setInput('currency', currency);
  fixture.detectChanges();
  return fixture;
}

describe('CurrencySelect', () => {
  it('shows the sign of the picked currency', () => {
    const element = buildSelect('SYP').nativeElement as HTMLElement;
    expect(element.textContent).toContain('ل.س');

    const dollars = buildSelect('USD').nativeElement as HTMLElement;
    expect(dollars.textContent).toContain('$');
  });

  it('offers the Syrian pound and the dollar, named in Arabic', () => {
    const select: HTMLSelectElement = buildSelect().nativeElement.querySelector('select');
    expect([...select.options].map((option) => option.value)).toEqual(['SYP', 'USD']);
    expect([...select.options].map((option) => option.textContent?.trim())).toEqual([
      'ل.س — ليرة سورية',
      '$ — دولار',
    ]);
  });

  it('marks the picked currency as the selected option', () => {
    const select: HTMLSelectElement = buildSelect('USD').nativeElement.querySelector('select');
    expect(select.value).toBe('USD');
  });

  it('emits the currency the admin picks', () => {
    const fixture = buildSelect();
    const picked: CurrencyCode[] = [];
    fixture.componentInstance.currencyChange.subscribe((code) => picked.push(code));

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    select.value = 'USD';
    select.dispatchEvent(new Event('change'));

    expect(picked).toEqual(['USD']);
  });

  it('names the control for screen readers', () => {
    const fixture = TestBed.createComponent(CurrencySelect);
    fixture.componentRef.setInput('currency', 'SYP');
    fixture.componentRef.setInput('label', 'عملة السعر');
    fixture.detectChanges();

    const select: HTMLSelectElement = fixture.nativeElement.querySelector('select');
    expect(select.getAttribute('aria-label')).toBe('عملة السعر');
  });

  it('draws the cap variant as the left edge of a bordered field', () => {
    const fixture = TestBed.createComponent(CurrencySelect);
    fixture.componentRef.setInput('currency', 'SYP');
    fixture.componentRef.setInput('variant', 'cap');
    fixture.detectChanges();

    const box: HTMLElement = fixture.nativeElement.querySelector('[data-role="currency-box"]');
    expect(box.className).toContain('rounded-s-lg');
  });
});
