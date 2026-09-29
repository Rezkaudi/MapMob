import { TestBed } from '@angular/core/testing';
import { buildDeliveryPlatformStatCards } from '../../state/delivery-platform-stat-cards';
import { buildDeliveryPlatformSummary } from '../../testing/delivery-platform-fixture';
import { DeliveryPlatformStatCards } from './delivery-platform-stat-cards';

describe('DeliveryPlatformStatCards', () => {
  it('draws the four cards in order, 20px apart', () => {
    const fixture = TestBed.createComponent(DeliveryPlatformStatCards);
    fixture.componentRef.setInput(
      'cards',
      buildDeliveryPlatformStatCards(buildDeliveryPlatformSummary()),
    );
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const values = Array.from(element.querySelectorAll('[data-role="value"]'), (value) =>
      value.textContent?.trim(),
    );
    expect(values).toEqual(['400', 'talabat', '300', '6']);
    expect(element.firstElementChild?.classList).toContain('gap-5');
  });
});
