import { TestBed } from '@angular/core/testing';
import { OfferCard } from './offer-card';

const OFFER = {
  id: 'offer-1',
  title: 'خصم 20 % على جميع المنتجات',
  category: 'الفيتامينات والمكملات',
  description: 'خصم خاص لفترة محدودة على كافة أصناف المكملات الغذائية',
  discountLabel: '20%',
  dateRange: '01 - 15 سبتمبر 2026',
  imageUrl: '',
};

describe('OfferCard', () => {
  it('shows the title, category, description, discount and date range', () => {
    const fixture = TestBed.createComponent(OfferCard);
    fixture.componentRef.setInput('offer', OFFER);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('خصم 20 % على جميع المنتجات');
    expect(text).toContain('الفيتامينات والمكملات');
    expect(text).toContain('خصم خاص لفترة محدودة');
    expect(text).toContain('20%');
    expect(text).toContain('01 - 15 سبتمبر 2026');
  });

  it('hides the discount badge when the offer has none', () => {
    const fixture = TestBed.createComponent(OfferCard);
    fixture.componentRef.setInput('offer', { ...OFFER, discountLabel: '' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-testid="offer-discount"]')).toBeNull();
  });
});
