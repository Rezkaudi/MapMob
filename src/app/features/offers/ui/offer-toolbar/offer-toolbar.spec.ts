import { TestBed } from '@angular/core/testing';
import { NO_OFFER_FILTERS } from '../../models/offer-filters';
import { OfferToolbar } from './offer-toolbar';

function render() {
  const fixture = TestBed.createComponent(OfferToolbar);
  fixture.componentRef.setInput('filters', NO_OFFER_FILTERS);
  fixture.detectChanges();
  return fixture;
}

describe('OfferToolbar', () => {
  it('searches offers and keeps sort and "الفلاتر" 8px apart', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('input')?.getAttribute('placeholder')).toBe('ابحث عن عرض..');
    expect((element.querySelector('app-sort-select')?.parentElement as HTMLElement).style.gap).toBe(
      '8px',
    );
  });

  it('opens the offer filter panel and passes an applied filter on, closing the panel', () => {
    const fixture = render();
    const filtersApply = vi.fn();
    fixture.componentInstance.filtersApply.subscribe(filtersApply);
    const element = fixture.nativeElement as HTMLElement;
    const filterButton = element.querySelector('button[aria-controls]') as HTMLButtonElement;

    filterButton.click();
    fixture.detectChanges();
    const applyButton = Array.from(element.querySelectorAll('app-offer-filter-panel button')).find(
      (button) => button.textContent?.trim() === 'تطبيق الفلاتر',
    ) as HTMLButtonElement;
    applyButton.click();
    fixture.detectChanges();

    expect(filtersApply).toHaveBeenCalledWith(NO_OFFER_FILTERS);
    expect(element.querySelector('app-offer-filter-panel')).toBeNull();
  });
});
