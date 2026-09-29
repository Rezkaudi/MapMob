import { TestBed } from '@angular/core/testing';
import { PlanCardView } from '../../models/plan-card-view';
import { buildPlanCards } from '../../state/plan-cards';
import { buildOverview } from '../../testing/merchant-subscription-fixture';
import { PlanOfferCard } from './plan-offer-card';

const [FREE, BASIC, FEATURED] = buildPlanCards(buildOverview(), 'monthly', '2026-09-10');

function render(card: PlanCardView) {
  const fixture = TestBed.createComponent(PlanOfferCard);
  fixture.componentRef.setInput('card', card);
  fixture.detectChanges();
  return fixture;
}

function textOf(element: HTMLElement, role: string): string {
  return element.querySelector(`[data-role="${role}"]`)?.textContent?.trim() ?? '';
}

describe('PlanOfferCard', () => {
  it('shows the eyebrow, name, tagline and price', () => {
    const element: HTMLElement = render(FEATURED).nativeElement;

    expect(textOf(element, 'eyebrow')).toBe('أقصى وصول وتأثير');
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('الباقة المميزة');
    expect(textOf(element, 'amount')).toBe('300,000');
    expect(textOf(element, 'currency')).toBe('ل.س');
    expect(textOf(element, 'period')).toBe('/ شهرياً');
    expect(textOf(element, 'price-note')).toBe('تتضمن دعم فني مخصص وأولوية ترويج');
  });

  it('leaves the period out of a free price', () => {
    expect(render(FREE).nativeElement.querySelector('[data-role="period"]')).toBeNull();
  });

  it('lists the limits, label first so RTL puts it on the right', () => {
    const rows = render(BASIC).nativeElement.querySelectorAll('[data-role="limit-row"]');

    expect(rows).toHaveLength(3);
    expect(rows[0].children[0].textContent.trim()).toBe('عدد الإعلانات:');
    expect(rows[0].children[1].textContent.trim()).toBe('5 إعلانات شهرياً');
  });

  it('paints the featured plan blue and outlines the current one', () => {
    expect(render(FEATURED).nativeElement.querySelector('article').className).toContain(
      'bg-linear-to-b',
    );
    const current = render(BASIC).nativeElement;
    expect(current.querySelector('article').className).toContain('border-primary');
    expect(textOf(current, 'current-ribbon')).toBe('باقتك الحالية');
    expect(render(FREE).nativeElement.querySelector('[data-role="current-ribbon"]')).toBeNull();
  });

  it('reports a press of its button with the card', () => {
    const fixture = render(FEATURED);
    const pressed = vi.fn();
    fixture.componentInstance.act.subscribe(pressed);

    const button = fixture.nativeElement.querySelector('[data-role="plan-action"]');
    expect(button.textContent.trim()).toBe('ترقية الباقة الآن');
    button.click();

    expect(pressed).toHaveBeenCalledWith(FEATURED);
  });

  it('disables the button of the current plan', () => {
    const button = render(BASIC).nativeElement.querySelector('[data-role="plan-action"]');

    expect(button.textContent.trim()).toBe('باقتك الحالية النشطة');
    expect(button.disabled).toBe(true);
  });
});
