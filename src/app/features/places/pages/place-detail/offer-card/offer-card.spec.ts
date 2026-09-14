import { TestBed } from '@angular/core/testing';
import { OfferCard } from './offer-card';
import { PlaceOffer } from '../../../models/place-offer';

const OFFER: PlaceOffer = {
  id: 'offer-1',
  title: 'خصم 20 % على جميع المنتجات',
  description: 'خصم خاص لفترة محدودة على كافة أصناف المكملات الغذائية',
  dateRange: '01 - 15 سبتمبر 2026',
  imageUrl: 'assets/images/offer-cosmetics.jpg',
  isActive: true,
};

function build(offer: PlaceOffer) {
  const fixture = TestBed.createComponent(OfferCard);
  fixture.componentRef.setInput('offer', offer);
  fixture.detectChanges();
  return fixture;
}

describe('OfferCard', () => {
  it('shows the title, description and date range', () => {
    const text = build(OFFER).nativeElement.textContent;

    expect(text).toContain('خصم 20 % على جميع المنتجات');
    expect(text).toContain('خصم خاص لفترة محدودة');
    expect(text).toContain('01 - 15 سبتمبر 2026');
  });

  it('tags a running offer "نشط" over the picture', () => {
    const tag: HTMLElement = build(OFFER).nativeElement.querySelector(
      '[data-testid="offer-status"]',
    );

    expect(tag.textContent?.trim()).toBe('نشط');
    expect(tag.className).toContain('bg-status-success');
  });

  it('tags a finished offer "منتهي"', () => {
    const tag: HTMLElement = build({ ...OFFER, isActive: false }).nativeElement.querySelector(
      '[data-testid="offer-status"]',
    );

    expect(tag.textContent?.trim()).toBe('منتهي');
  });

  it('shows the offer picture', () => {
    const image: HTMLImageElement = build(OFFER).nativeElement.querySelector('img');

    expect(image.getAttribute('src')).toBe('assets/images/offer-cosmetics.jpg');
  });
});
