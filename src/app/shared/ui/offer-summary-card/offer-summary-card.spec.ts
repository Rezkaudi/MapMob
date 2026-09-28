import { TestBed } from '@angular/core/testing';
import { OfferSummaryCard } from './offer-summary-card';

function build(imageUrl: string | null) {
  const fixture = TestBed.createComponent(OfferSummaryCard);
  fixture.componentRef.setInput('title', 'خصم 30% على جميع الأزياء الشتوية');
  fixture.componentRef.setInput('description', 'احصل على خصم فوري.');
  fixture.componentRef.setInput('imageUrl', imageUrl);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('OfferSummaryCard', () => {
  it('shows the title over the description', () => {
    const host = build(null);

    expect(host.querySelector('h3')?.textContent?.trim()).toBe('خصم 30% على جميع الأزياء الشتوية');
    expect(host.querySelector('p')?.textContent?.trim()).toBe('احصل على خصم فوري.');
    expect(host.querySelector('img')).toBeNull();
  });

  it('leaves the description line out when there is none', () => {
    const fixture = TestBed.createComponent(OfferSummaryCard);
    fixture.componentRef.setInput('title', 'خصم');
    fixture.componentRef.setInput('description', null);
    fixture.detectChanges();

    expect((fixture.nativeElement as HTMLElement).querySelector('p')).toBeNull();
  });

  it("puts the offer's picture above them when it has one", () => {
    const image = build('/assets/images/offer-winter-clothes.jpg').querySelector('img');

    expect(image?.getAttribute('src')).toBe('/assets/images/offer-winter-clothes.jpg');
    expect(image?.classList).toContain('h-[174px]');
  });
});
