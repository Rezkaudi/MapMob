import { buildSummary } from '../testing/game-fixture';
import { ALL_GAMES_CHIP, buildGameStatusChips } from './game-status-chips';

describe('buildGameStatusChips', () => {
  it('leads with every game, then the scheduled and the finished ones', () => {
    const chips = buildGameStatusChips(buildSummary());
    expect(chips).toEqual([
      { value: ALL_GAMES_CHIP, label: 'الكل', count: 120 },
      { value: 'scheduled', label: 'مجدولة', count: 12, dotClass: 'bg-status-success' },
      { value: 'finished', label: 'منتهية', count: 20, dotClass: 'bg-closed' },
    ]);
  });
});
