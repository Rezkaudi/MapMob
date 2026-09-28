import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { describeProductQuota } from '../../state/product-quota';
import { ProductUsageCard } from './product-usage-card';

function build(usedCount = 3, limit = 5) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(ProductUsageCard);
  fixture.componentRef.setInput('planName', 'الباقة المجانية');
  fixture.componentRef.setInput('quota', describeProductQuota(usedCount, limit));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

function text(host: HTMLElement, role: string): string {
  return host.querySelector(`[data-role="${role}"]`)?.textContent?.trim() ?? '';
}

describe('ProductUsageCard', () => {
  it('names the products used, the plan and what is left', () => {
    const host = build();

    expect(text(host, 'title')).toBe('المنتجات المستخدمة');
    expect(text(host, 'plan')).toBe('الباقة المجانية');
    expect(text(host, 'notice')).toBe('متبقي لك منتجان ضمن باقتك الحالية قبل الوصول للحد المتاح.');
    expect(text(host, 'used-count')).toBe('3');
    expect(text(host, 'limit')).toBe('/ 5 منتجات');
    expect(text(host, 'remaining')).toBe('متبقي لك منتجان');
  });

  it('fills the bar to the used share', () => {
    const bar = build().querySelector('[role="progressbar"]') as HTMLElement;

    expect(bar.getAttribute('aria-valuenow')).toBe('60');
    expect((bar.firstElementChild as HTMLElement).style.width).toBe('60%');
  });

  it('links "ترقية الباقة" to the subscription page', () => {
    const link = build().querySelector('a[data-role="upgrade"]') as HTMLAnchorElement;

    expect(link.textContent?.trim()).toBe('ترقية الباقة');
    expect(link.getAttribute('href')).toBe('/merchant/subscription');
  });

  it("writes each pair so RTL puts the frame's right-hand item first", () => {
    const host = build();
    const children = (role: string) =>
      [...(host.querySelector(`[data-role="${role}"]`)?.children ?? [])].map(
        (child) => child.getAttribute('data-role') ?? child.tagName.toLowerCase(),
      );

    expect(children('heading-row')).toEqual(['title', 'plan']);
    expect(children('top-row')).toEqual(['heading', 'upgrade']);
    expect(children('usage-row')).toEqual(['usage', 'remaining']);
    expect(children('usage')).toEqual(['used-count', 'limit']);
    expect(children('upgrade')).toEqual(['app-icon', 'span']);
  });

  it('turns the chip red once the plan is full', () => {
    const chip = build(5, 5).querySelector('[data-role="remaining"]') as HTMLElement;

    expect(chip.textContent?.trim()).toBe('وصلت للحد المتاح');
    expect(chip.classList).toContain('bg-error');
  });
});
