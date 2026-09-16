import { TestBed } from '@angular/core/testing';
import { OfferScope } from '../../models/offer-scope';
import { OfferScopePicker } from './offer-scope-picker';

function render(scope: OfferScope) {
  const fixture = TestBed.createComponent(OfferScopePicker);
  fixture.componentRef.setInput('scope', scope);
  fixture.componentRef.setInput('items', [{ id: 'i1', name: 'شامبو 1', price: 200 }]);
  fixture.componentRef.setInput('selectedItemIds', []);
  fixture.componentRef.setInput('itemsError', 'اختر منتجاً أو خدمة واحدة على الأقل');
  fixture.detectChanges();
  return fixture;
}

describe('OfferScopePicker', () => {
  it('offers everything on the right and picked items on the left', () => {
    const element = render('allItems').nativeElement as HTMLElement;
    const cards = Array.from(element.querySelectorAll('[role="radio"]'));

    expect(cards.map((card) => card.querySelector('.font-bold')?.textContent?.trim())).toEqual([
      'جميع المنتجات والخدمات',
      'منتجات وخدمات محددة',
    ]);
    expect(cards[0].getAttribute('aria-checked')).toBe('true');
    expect(element.querySelector('app-offer-item-picker')).toBeNull();
  });

  it('opens the item list with its error for picked items only, and reports a new scope', () => {
    const fixture = render('selectedItems');
    const scopeChange = vi.fn();
    fixture.componentInstance.scopeChange.subscribe(scopeChange);
    const element = fixture.nativeElement as HTMLElement;

    expect(element.textContent).toContain('المنتجات والخدمات المشمولة بالعرض');
    expect(element.querySelector('app-offer-item-picker')).toBeTruthy();
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe(
      'اختر منتجاً أو خدمة واحدة على الأقل',
    );

    (element.querySelector('[role="radio"]') as HTMLButtonElement).click();
    expect(scopeChange).toHaveBeenCalledWith('allItems');
  });
});
