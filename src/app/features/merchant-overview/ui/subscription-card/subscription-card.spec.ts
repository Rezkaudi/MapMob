import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { MerchantSubscription } from '../../models/merchant-subscription';
import { describeSubscriptionProgress } from '../../state/subscription-progress';
import { SubscriptionCard } from './subscription-card';

const SUBSCRIPTION: MerchantSubscription = {
  plan: { id: 'plan-featured', name: 'الباقة المميزة' },
  startsOn: '2026-01-01',
  endsOn: '2026-12-31',
  features: ['ظهور متقدم في نتائج البحث', '50 منتج مضاف إلى متجرك', 'معرض صور وفيديوهات متكامل'],
};

function render() {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(SubscriptionCard);
  fixture.componentRef.setInput('subscription', SUBSCRIPTION);
  fixture.componentRef.setInput(
    'progress',
    describeSubscriptionProgress(SUBSCRIPTION, '2026-07-26'),
  );
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('SubscriptionCard', () => {
  it('titles the card with the plan name and the green award tile', () => {
    const element = render();

    expect(element.querySelector('h2')!.textContent!.trim()).toBe('الباقة المميزة');
    expect(element.querySelector('.bg-status-success app-icon')).toBeTruthy();
  });

  it('writes the label before the dates, so RTL puts "فترة الاشتراك:" on the right', () => {
    const element = render();

    const row = element.querySelector('[data-role="period"]')!;
    expect(row.children[0].textContent!.trim()).toBe('فترة الاشتراك:');
    expect(row.children[1].textContent!.trim()).toBe('01 يناير 2026 — 31 ديسمبر 2026');
  });

  it('fills the bar from the right by the used share, and says so to screen readers', () => {
    const element = render();

    const bar = element.querySelector('[role="progressbar"]')!;
    expect(bar.getAttribute('aria-valuenow')).toBe('57');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('57%');
    const legend = element.querySelector('[data-role="usage"]')!;
    expect(legend.children[0].textContent!.trim()).toBe('تم استهلاك 57%');
    expect(legend.children[1].textContent!.trim()).toBe('متبقي 158 يوماً');
  });

  it('lists the features right to left in two columns', () => {
    const element = render();

    const list = element.querySelector('ul')!;
    expect(list.classList).toContain('grid-cols-2');
    expect([...list.querySelectorAll('li')].map((item) => item.textContent!.trim())).toEqual(
      SUBSCRIPTION.features,
    );
  });

  it('offers the upgrade link', () => {
    const element = render();

    const link = [...element.querySelectorAll('a')].at(-1)!;
    expect(link.textContent!.trim()).toBe('ترقية الباقة أو التجديد');
    expect(link.getAttribute('href')).toBe('/merchant/subscription');
  });

  it('sets the button 8px under the features, as the 325px frame draws it', () => {
    const element = render();

    const section = element.querySelector('section')!;
    expect(section.classList).not.toContain('gap-[22px]');
    expect(section.lastElementChild!.classList).toContain('pt-2');
  });
});
