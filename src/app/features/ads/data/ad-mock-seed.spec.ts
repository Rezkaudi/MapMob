import { toCalendarDay } from '../../../shared/formatting/calendar-day';
import { resolveRunningStatus } from '../../../shared/state/campaign-running-status';
import { buildAdSeed } from './ad-mock-seed';

const NOW = new Date(2026, 8, 15, 12, 0);

describe('buildAdSeed', () => {
  it('builds the same ads every time, with unique ids and ordered days', () => {
    const first = buildAdSeed(NOW, 60);

    expect(first).toEqual(buildAdSeed(NOW, 60));
    expect(new Set(first.map((detail) => detail.ad.id)).size).toBe(60);
    expect(first.every(({ ad }) => ad.endsOn === null || ad.startsOn <= ad.endsOn)).toBe(true);
  });

  it('keeps running statuses true to the days and links admin ads to no store', () => {
    const details = buildAdSeed(NOW, 200);

    expect(
      details
        .filter(({ ad }) => ad.status !== 'paused' && ad.status !== 'draft')
        .every(({ ad }) => ad.status === resolveRunningStatus(ad, toCalendarDay(NOW))),
    ).toBe(true);
    expect(
      details.every(
        ({ ad, placeId }) =>
          (ad.advertiserType === 'admin') === (placeId === null && ad.placeName === null),
      ),
    ).toBe(true);
    expect(new Set(details.map(({ ad }) => ad.advertiserType))).toEqual(
      new Set(['place', 'admin']),
    );
  });

  it('starts with the four sample rows the design draws', () => {
    const rows = buildAdSeed(NOW, 6)
      .slice(0, 4)
      .map((detail) => detail.ad);

    expect(
      rows.map(({ contentType, placement, priority, status }) => [
        contentType,
        placement,
        priority,
        status,
      ]),
    ).toEqual([
      ['image', 'home', 5, 'active'],
      ['video', 'searchResults', 3, 'paused'],
      ['image', 'home', 5, 'scheduled'],
      ['image', 'home', 5, 'active'],
    ]);
    expect(rows.every((ad) => ad.placeName === 'ألبسة الفاخر')).toBe(true);
  });
});
