import { TestBed } from '@angular/core/testing';
import { MerchantSubscriptionSkeleton } from './merchant-subscription-skeleton';

function render(): HTMLElement {
  const fixture = TestBed.createComponent(MerchantSubscriptionSkeleton);
  fixture.detectChanges();
  return fixture.nativeElement;
}

const countIn = (host: HTMLElement, role: string): number =>
  host.querySelectorAll(`[data-role="${role}"] app-skeleton`).length;

describe('MerchantSubscriptionSkeleton', () => {
  it('stands in for the hero, four usage cards, three plans and the history', () => {
    const host = render();

    expect(countIn(host, 'hero')).toBe(1);
    expect(countIn(host, 'usage')).toBe(4);
    expect(countIn(host, 'plans')).toBe(3);
    expect(countIn(host, 'history')).toBe(1);
  });

  it('tells screen readers the page is loading', () => {
    const host = render();

    expect(host.querySelector('[role="status"]')?.textContent?.trim()).toBe('جاري التحميل');
  });
});
