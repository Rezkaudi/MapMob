import { buildGame } from '../testing/game-fixture';
import { buildLiveWinner } from '../testing/live-game-fixture';
import { toGameWinner } from './live-winner-mapping';

const GAME = buildGame({ id: '9', roundNumber: 9, name: 'الأكثرية والأقلية' });

describe('toGameWinner', () => {
  it('turns a server winner into a table row, with the prize of its game', () => {
    expect(toGameWinner(buildLiveWinner(), [GAME])).toEqual({
      id: '4',
      game: { id: '9', name: 'الأكثرية والأقلية', roundNumber: 9 },
      user: { id: '5', name: 'سارة' },
      phone: '0933000000',
      email: null,
      prize: { kind: 'cash', value: { amount: 50000, currency: 'SYP' }, sponsorName: null },
      wonOn: '2026-12-01',
      deliveryStatus: 'pending',
    });
  });

  it('reads a delivered prize', () => {
    const winner = toGameWinner(buildLiveWinner({ delivery_status: 'delivered' }), [GAME]);
    expect(winner.deliveryStatus).toBe('delivered');
  });

  it('finds the game by its id when the winner names no game', () => {
    const winner = toGameWinner(buildLiveWinner({ game: null, game_id: 9 }), [GAME]);
    expect(winner.game.name).toBe('الأكثرية والأقلية');
  });
});
