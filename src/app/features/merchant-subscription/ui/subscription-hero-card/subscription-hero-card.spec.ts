import { TestBed } from '@angular/core/testing';
import { SubscriptionHeroView } from '../../models/subscription-hero-view';
import { buildSubscriptionHero } from '../../state/subscription-hero';
import { buildOverview } from '../../testing/merchant-subscription-fixture';
import { SubscriptionHeroCard } from './subscription-hero-card';

function render(patch: Partial<SubscriptionHeroView> = {}) {
  const fixture = TestBed.createComponent(SubscriptionHeroCard);
  fixture.componentRef.setInput('hero', { ...buildSubscriptionHero(buildOverview()), ...patch });
  fixture.detectChanges();
  return fixture;
}

function textOf(element: HTMLElement, role: string): string {
  return element.querySelector(`[data-role="${role}"]`)?.textContent?.trim() ?? '';
}

describe('SubscriptionHeroCard', () => {
  it('shows the plan, its price and its status', () => {
    const element: HTMLElement = render().nativeElement;

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('الباقة الأساسية');
    expect(textOf(element, 'amount')).toBe('150,000');
    expect(textOf(element, 'period')).toBe('ل.س / شهرياً');
    expect(textOf(element, 'current-chip')).toBe('باقتك الحالية');
    expect(element.querySelector('app-subscription-status-badge')?.textContent).toContain('نشطة');
  });

  it('lists start, end and payment tiles right to left, dates kept left to right', () => {
    const tiles = render().nativeElement.querySelectorAll('[data-role="fact"]');

    expect(
      Array.from(tiles, (tile: Element) => tile.querySelector('dt')?.textContent?.trim()),
    ).toEqual(['تاريخ بداية الاشتراك', 'تاريخ انتهاء الاشتراك', 'طريقة السداد المعتمدة']);
    expect(tiles[0].querySelector('dd')?.textContent?.trim()).toBe('01 / 09 / 2026');
    expect(tiles[0].querySelector('dd')?.getAttribute('dir')).toBe('ltr');
    expect(tiles[2].querySelector('dd')?.textContent?.trim()).toBe('الدفع النقدي المباشر');
  });

  it('asks for the upgrade and the details from its two buttons', () => {
    const fixture = render();
    const upgrade = vi.fn();
    const details = vi.fn();
    fixture.componentInstance.upgrade.subscribe(upgrade);
    fixture.componentInstance.details.subscribe(details);

    (fixture.nativeElement.querySelector('[data-role="upgrade"]') as HTMLButtonElement).click();
    (fixture.nativeElement.querySelector('[data-role="details"]') as HTMLButtonElement).click();

    expect(upgrade).toHaveBeenCalledOnce();
    expect(details).toHaveBeenCalledOnce();
  });

  it('hides the upgrade on the top tier and locks it while a request waits', () => {
    expect(
      render({ upgradeTarget: null }).nativeElement.querySelector('[data-role="upgrade"]'),
    ).toBeNull();

    const locked = render({ canUpgrade: false }).nativeElement.querySelector(
      '[data-role="upgrade"]',
    );
    expect(locked.disabled).toBe(true);
  });
});
