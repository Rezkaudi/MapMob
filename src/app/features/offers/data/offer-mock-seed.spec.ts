import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { buildOfferSeed } from './offer-mock-seed';

const NOW = new Date(2026, 8, 15, 12, 0);
const TODAY = toCalendarDay(NOW);

describe('buildOfferSeed', () => {
  it('builds the same offers every time, each ending on or after its first day', () => {
    const first = buildOfferSeed(NOW, 60);

    expect(first).toHaveLength(60);
    expect(first).toEqual(buildOfferSeed(NOW, 60));
    expect(first.every((detail) => detail.offer.startsOn <= detail.offer.endsOn)).toBe(true);
    expect(new Set(first.map((detail) => detail.offer.id)).size).toBe(60);
  });

  it('gives running offers the status their days give them today', () => {
    const details = buildOfferSeed(NOW, 200);
    const running = details.filter(
      (detail) => detail.offer.status !== 'paused' && detail.offer.status !== 'draft',
    );

    expect(
      running.every((detail) => detail.offer.status === resolveRunningStatus(detail.offer, TODAY)),
    ).toBe(true);
    expect(new Set(details.map((detail) => detail.offer.status))).toEqual(
      new Set(['active', 'scheduled', 'paused', 'expired', 'draft']),
    );
  });

  it('keeps the place of the row and of the detail the same', () => {
    expect(
      buildOfferSeed(NOW, 40).every(
        (detail) =>
          detail.offer.placeName === detail.place.name &&
          detail.offer.categoryName === detail.place.categoryName,
      ),
    ).toBe(true);
  });

  it('starts with the four sample rows the design draws', () => {
    const rows = buildOfferSeed(NOW, 6)
      .slice(0, 4)
      .map((detail) => detail.offer);

    expect(rows.map((offer) => offer.status)).toEqual(['active', 'scheduled', 'paused', 'active']);
    expect(
      rows.every(
        (offer) =>
          offer.title === 'خصم 30% على جميع الأزياء الشتوية' &&
          offer.placeName === 'ألبسة الفاخر' &&
          offer.categoryName === 'ألبسة',
      ),
    ).toBe(true);
  });

  it('fills the form fields of each offer from its store', () => {
    expect(
      buildOfferSeed(NOW, 40).every(
        (detail) =>
          detail.discountPercent > 0 &&
          detail.itemIds.every((id) => id.startsWith(`${detail.place.id}-item-`)) &&
          (detail.scope === 'selectedItems') === detail.itemIds.length > 0,
      ),
    ).toBe(true);
  });
});
