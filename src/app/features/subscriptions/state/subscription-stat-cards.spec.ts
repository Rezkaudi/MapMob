import { describe, expect, it } from 'vitest';
import { SubscriptionSummary } from '../models/subscription-summary';
import { buildSubscriptionStatCards } from './subscription-stat-cards';

const summary: SubscriptionSummary = {
  topPlanName: 'أساسية',
  topPlanSubscriberCount: 630,
  availablePlanCount: 3,
  endingSoonCount: 7,
  activeSubscriberCount: 1200,
  activeSubscriberShare: 0.9,
};

describe('buildSubscriptionStatCards', () => {
  /**
   * RTL renders the first card on the right, and the design puts "المشتركون النشطون"
   * there and "الباقة الأكثر طلباً" on the far left.
   */
  it('builds the four cards the design draws, right to left', () => {
    const cards = buildSubscriptionStatCards(summary);

    expect(cards.map((card) => card.label)).toEqual([
      'المشتركون النشطون',
      'ينتهي قريباً (خلال 7 أيام)',
      'الباقات المتاحة',
      'الباقة الأكثر طلباً',
    ]);
  });

  it('names the most wanted package and counts its subscribers on a red chip', () => {
    const card = buildSubscriptionStatCards(summary)[3];

    expect(card.value).toBe('أساسية');
    expect(card.badge).toBe('630 مشتركاً');
    expect(card.badgeTone).toBe('error');
  });

  it('counts the available packages without a chip', () => {
    const card = buildSubscriptionStatCards(summary)[2];

    expect(card.value).toBe('3');
    expect(card.badge).toBeNull();
  });

  it('flags the subscriptions ending soon in amber', () => {
    const card = buildSubscriptionStatCards(summary)[1];

    expect(card.value).toBe('7');
    expect(card.badge).toBe('تتطلب متابعة');
    expect(card.badgeTone).toBe('warning');
  });

  it('writes the active share as a whole percentage', () => {
    const [card] = buildSubscriptionStatCards(summary);

    expect(card.value).toBe('1200');
    expect(card.badge).toBe('90% من الإجمالي');
    expect(card.badgeTone).toBe('success');
  });

  it('rounds a share that does not land on a whole percentage', () => {
    const cards = buildSubscriptionStatCards({ ...summary, activeSubscriberShare: 0.8765 });

    expect(cards[0].badge).toBe('88% من الإجمالي');
  });
});
