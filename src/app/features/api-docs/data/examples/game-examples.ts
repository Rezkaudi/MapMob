import type { GameDetail } from '../../../games/models/game-detail';
import type { GameDraft } from '../../../games/models/game-draft';
import type { GameEntry } from '../../../games/models/game-entry';
import type { GamePage } from '../../../games/models/game-page';
import type { GameSummary } from '../../../games/models/game-summary';
import type { GameWinner } from '../../../games/models/game-winner';
import type { WinnerPage } from '../../../games/models/winner-page';

export const GAME_ROW = {
  id: '104',
  name: 'الأكثرية والأقلية',
  roundNumber: 104,
  startsAt: '2026-10-15T15:00:00Z',
  timeZone: 'Asia/Damascus',
  questionCount: 10,
  participantCount: 0,
  prize: {
    kind: 'cash',
    value: { amount: 50000, currency: 'SYP' },
    sponsorName: null,
    maxWinnerCount: 10,
  },
  status: 'scheduled',
} satisfies GameEntry;

const FINISHED_GAME_ROW = {
  ...GAME_ROW,
  id: '99',
  roundNumber: 99,
  startsAt: '2026-09-30T15:00:00Z',
  participantCount: 214,
  prize: {
    kind: 'voucher',
    value: { amount: 20000, currency: 'SYP' },
    sponsorName: 'كافية النور',
    maxWinnerCount: 4,
  },
  status: 'finished',
} satisfies GameEntry;

export const GAME_PAGE = {
  items: [GAME_ROW, FINISHED_GAME_ROW],
  totalCount: 120,
} satisfies GamePage;

export const GAME_SUMMARY = {
  gameCount: 120,
  scheduledCount: 12,
  finishedCount: 105,
  participantCount: 25480,
  winnerCount: 412,
  deliveredPrizeCount: 380,
  upcomingGame: GAME_ROW,
} satisfies GameSummary;

export const GAME_DETAIL = {
  ...FINISHED_GAME_ROW,
  questionCount: 1,
  description: 'صوّت مع الأغلبية واربح جوائز',
  voteSeconds: 10,
  questions: [
    {
      id: '880',
      text: 'ما المشروب الذي يفضله معظم الأشخاص في الصباح؟',
      options: [
        { id: '1760', text: 'القهوة', voteCount: 124 },
        { id: '1761', text: 'الشاي', voteCount: 51 },
      ],
    },
  ],
  winnerCount: 4,
  deliveredPrizeCount: 2,
} satisfies GameDetail;

export const GAME_DRAFT = {
  name: 'الأكثرية والأقلية',
  description: 'صوّت مع الأغلبية واربح جوائز',
  startsAt: '2026-10-15T18:00:00+03:00',
  timeZone: 'Asia/Damascus',
  voteSeconds: 10,
  questions: [
    { text: 'ما المشروب الذي يفضله معظم الأشخاص في الصباح؟', options: ['القهوة', 'الشاي'] },
  ],
  prize: {
    kind: 'cash',
    value: { amount: 50000, currency: 'SYP' },
    sponsorName: null,
    maxWinnerCount: 10,
  },
  status: 'scheduled',
} satisfies GameDraft;

export const GAME_WINNER = {
  id: '3120',
  game: { id: '99', name: 'الأكثرية والأقلية', roundNumber: 99 },
  user: { id: '512', name: 'أحمد جمال' },
  phone: '0933608934',
  email: null,
  prize: { kind: 'voucher', value: { amount: 5000, currency: 'SYP' }, sponsorName: 'كافية النور' },
  wonOn: '2026-09-30',
  deliveryStatus: 'pending',
} satisfies GameWinner;

export const WINNER_PAGE = {
  items: [
    GAME_WINNER,
    {
      ...GAME_WINNER,
      id: '3121',
      user: { id: '77', name: 'سارة علي' },
      deliveryStatus: 'delivered',
    },
  ],
  totalCount: 412,
} satisfies WinnerPage;
