import { LiveGame } from '../data/live-game';
import { LiveWinner } from '../data/live-winner';

export function buildLiveGame(overrides: Partial<LiveGame> = {}): LiveGame {
  return {
    id: 9,
    name: 'الأكثرية والأقلية',
    description: 'صوت مع الأغلبية',
    starts_at: '2026-12-01T15:00:00+00:00',
    ends_at: null,
    timezone: 'Asia/Damascus',
    answer_time_seconds: '10',
    status: 'scheduled',
    prize: { type: 'cash', value: '50000.00', currency_code: 'SYP' },
    max_winners: '3',
    questions_count: 2,
    winners_count: 0,
    ...overrides,
  };
}

export function buildLiveWinner(overrides: Partial<LiveWinner> = {}): LiveWinner {
  return {
    id: 4,
    game: { id: 9, name: 'الأكثرية والأقلية' },
    user: { id: 5, name: 'سارة', phone: '0933000000', email: null },
    delivery_status: 'pending',
    created_at: '2026-12-01T16:00:00+00:00',
    ...overrides,
  };
}
