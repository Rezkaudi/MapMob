import { TestBed } from '@angular/core/testing';
import { PackagePlan } from '../../models/package-plan';
import { PlanCard } from './plan-card';

function plan(patch: Partial<PackagePlan> = {}): PackagePlan {
  return {
    id: 'basic',
    name: 'أساسية',
    tier: 'basic',
    tagline: 'الباقة المثلى للمتاجر المتوسطة لزيادة الانتشار والوصول للزبائن المحليين.',
    badge: 'الأكثر مبيعاً',
    monthlyPrice: 20,
    yearlyPrice: 192,
    currency: 'دولار',
    subscriberCount: 620,
    limits: { adsPerMonth: 10, activeOffers: 20, galleryImages: 30, videos: 5 },
    features: ['كل مزايا الباقة المجانية', 'أولوية متقدمة في نتائج البحث والتصفية'],
    isActive: true,
    ...patch,
  };
}

function render(patch: Partial<PackagePlan> = {}) {
  const fixture = TestBed.createComponent(PlanCard);
  fixture.componentRef.setInput('plan', plan(patch));
  fixture.detectChanges();
  return fixture;
}

function textOf(fixture: ReturnType<typeof render>, selector: string): string {
  return fixture.nativeElement.querySelector(selector)?.textContent?.trim() ?? '';
}

describe('PlanCard', () => {
  it('names the package and shows its badge', () => {
    const fixture = render();

    expect(textOf(fixture, '[data-role="name"]')).toBe('أساسية');
    expect(textOf(fixture, '[data-role="badge"]')).toBe('الأكثر مبيعاً');
  });

  it('leaves the badge out when the package has none', () => {
    expect(render({ badge: null }).nativeElement.querySelector('[data-role="badge"]')).toBeFalsy();
  });

  it('prices the package with its currency and period', () => {
    const fixture = render();

    expect(textOf(fixture, '[data-role="amount"]')).toBe('20');
    expect(textOf(fixture, '[data-role="currency"]')).toBe('دولار');
    expect(textOf(fixture, '[data-role="period"]')).toBe('/ شهرياً');
  });

  it('writes a free package as "مجاناً" with no currency', () => {
    const fixture = render({ tier: 'free', monthlyPrice: 0 });

    expect(textOf(fixture, '[data-role="amount"]')).toBe('مجاناً');
    expect(fixture.nativeElement.querySelector('[data-role="currency"]')).toBeFalsy();
  });

  it('lists the three usage limits', () => {
    const rows = render().nativeElement.querySelectorAll('[data-role="limit-row"]');

    expect(rows).toHaveLength(3);
    expect(rows[0].textContent).toContain('عدد الإعلانات:');
    expect(rows[0].textContent).toContain('10 إعلانات شهرياً');
  });

  it('lists every feature of the package', () => {
    const items = render().nativeElement.querySelectorAll('[data-role="feature"]');

    expect(items).toHaveLength(2);
    expect(items[0].textContent).toContain('كل مزايا الباقة المجانية');
  });

  it('asks to edit the package from the bottom button', () => {
    const fixture = render();
    let edited: PackagePlan | null = null;
    fixture.componentInstance.edit.subscribe((value: PackagePlan) => (edited = value));

    fixture.nativeElement.querySelector('[data-role="edit"]').click();

    expect(edited).not.toBeNull();
  });

  it('paints the featured tier on the blue gradient', () => {
    const card = render({ tier: 'featured' }).nativeElement.querySelector('article');

    expect(card.className).toContain('bg-linear-to-b');
  });
});
