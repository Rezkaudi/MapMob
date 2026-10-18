import { buildGame } from '../testing/game-fixture';
import { toGameRow } from './game-row';

describe('toGameRow', () => {
  it('writes the round, the start and the prize as the table shows them', () => {
    const row = toGameRow(buildGame({ startsAt: '2025-10-15T17:00:00.000Z' }));
    expect(row.roundLabel).toBe('الجولة #104');
    expect(row.dayText).toBe('15 أكتوبر 2025');
    expect(row.timeText).toBe('8:00 مساء');
    expect(row.prizeText).toBe('50,000 ل.س');
    expect(row.participantsText).toBe('214');
  });

  it('paints each status its own pill', () => {
    expect(toGameRow(buildGame({ status: 'scheduled' })).pillClass).toBe('bg-accent');
    expect(toGameRow(buildGame({ status: 'finished' })).pillClass).toBe('bg-closed');
    expect(toGameRow(buildGame({ status: 'finished' })).statusLabel).toBe('منتهية');
  });

  it('lets only a game that has not finished be edited or deleted', () => {
    expect(toGameRow(buildGame({ status: 'scheduled' })).canChange).toBe(true);
    expect(toGameRow(buildGame({ status: 'draft' })).canChange).toBe(true);
    expect(toGameRow(buildGame({ status: 'finished' })).canChange).toBe(false);
  });
});
