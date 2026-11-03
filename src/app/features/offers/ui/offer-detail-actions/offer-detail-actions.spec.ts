import { TestBed } from '@angular/core/testing';
import { OfferDetailActions } from './offer-detail-actions';

function render() {
  const fixture = TestBed.createComponent(OfferDetailActions);
  fixture.componentRef.setInput('pauseAction', 'pause');
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('OfferDetailActions', () => {
  it('spins only on the pressed button while its change saves', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'إيقاف العرض').click();
    fixture.componentRef.setInput('isBusy', true);
    fixture.detectChanges();

    const buttons = Array.from(element.querySelectorAll('button'));
    const spinning = buttons.filter((button) => button.querySelector('app-spinner'));
    expect(spinning.map((button) => button.textContent?.trim())).toEqual(['إيقاف العرض']);
    expect(buttons.every((button) => button.disabled)).toBe(true);
  });
});
