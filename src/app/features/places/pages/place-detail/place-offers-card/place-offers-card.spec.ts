import { TestBed } from '@angular/core/testing';
import { PlaceOffersCard } from './place-offers-card';

const OFFER = {
  id: 'offer-1',
  title: 'خصم 20 % على جميع المنتجات',
  category: 'الفيتامينات والمكملات',
  description: 'خصم خاص لفترة محدودة',
  discountLabel: '20%',
  dateRange: '01 - 15 سبتمبر 2026',
  imageUrl: '',
};

describe('PlaceOffersCard', () => {
  it('counts the offers and names the place in the subtitle', () => {
    const fixture = TestBed.createComponent(PlaceOffersCard);
    fixture.componentRef.setInput('offers', [OFFER, { ...OFFER, id: 'offer-2' }]);
    fixture.componentRef.setInput('placeName', 'صيدلية الحياة');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('العروض الترويجية');
    expect(text).toContain('2 عروض');
    expect(text).toContain('العروض الترويجية الحالية الخاصة بصيدلية الحياة');
    expect(text).toContain('إضافة عرض');
  });

  it('renders one card per offer', () => {
    const fixture = TestBed.createComponent(PlaceOffersCard);
    fixture.componentRef.setInput('offers', [OFFER, { ...OFFER, id: 'offer-2' }]);
    fixture.componentRef.setInput('placeName', 'صيدلية الحياة');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-offer-card').length).toBe(2);
  });

  it('explains that there are no offers yet', () => {
    const fixture = TestBed.createComponent(PlaceOffersCard);
    fixture.componentRef.setInput('offers', []);
    fixture.componentRef.setInput('placeName', 'صيدلية الحياة');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('لا توجد عروض ترويجية حالياً');
  });
});
