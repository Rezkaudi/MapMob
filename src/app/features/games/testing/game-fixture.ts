import { GameDetail } from '../models/game-detail';
import { GameEntry } from '../models/game-entry';
import { GameSummary } from '../models/game-summary';
import { GameWinner } from '../models/game-winner';

/** 18:00 in Damascus on 15 October 2026. */
export const FIXTURE_STARTS_AT = '2026-10-15T15:00:00.000Z';

export function buildGame(overrides: Partial<GameEntry> = {}): GameEntry {
  return {
    id: 'game-104',
    name: 'الأكثرية والأقلية',
    roundNumber: 104,
    startsAt: FIXTURE_STARTS_AT,
    timeZone: 'Asia/Damascus',
    questionCount: 12,
    participantCount: 214,
    prize: {
      kind: 'cash',
      value: { amount: 50000, currency: 'SYP' },
      sponsorName: null,
      maxWinnerCount: 10,
    },
    status: 'scheduled',
    ...overrides,
  };
}

export function buildGameDetail(overrides: Partial<GameDetail> = {}): GameDetail {
  return {
    ...buildGame(),
    description: 'صوت مع الأغلبية واربح جوائز',
    voteSeconds: 10,
    questions: [
      {
        id: 'question-1',
        text: 'ما المشروب الذي يفضله معظم الأشخاص في الصباح؟',
        options: [
          { id: 'option-1', text: 'القهوة', voteCount: null },
          { id: 'option-2', text: 'الشاي', voteCount: null },
        ],
      },
    ],
    winnerCount: 0,
    deliveredPrizeCount: 0,
    ...overrides,
  };
}

export function buildWinner(overrides: Partial<GameWinner> = {}): GameWinner {
  return {
    id: 'winner-1',
    game: { id: 'game-104', name: 'الأكثرية والأقلية', roundNumber: 104 },
    user: { id: 'user-1', name: 'أحمد جمال' },
    phone: '093608934',
    email: null,
    prize: { kind: 'cash', value: { amount: 50000, currency: 'SYP' }, sponsorName: null },
    wonOn: '2023-01-16',
    deliveryStatus: 'delivered',
    ...overrides,
  };
}

export function buildSummary(overrides: Partial<GameSummary> = {}): GameSummary {
  return {
    gameCount: 120,
    scheduledCount: 12,
    finishedCount: 20,
    participantCount: 120,
    winnerCount: 25,
    deliveredPrizeCount: 20,
    upcomingGame: buildGame(),
    ...overrides,
  };
}
