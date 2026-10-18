import { GameDetail } from '../models/game-detail';
import { GameStatus } from '../models/game-status';
import { GameWinner } from '../models/game-winner';
import { GamePrize } from '../models/game-prize';
import { toZonedSchedule } from '../state/game-schedule-text';
import { GameMockSeed } from './game-mock-database';
import {
  SAMPLE_GAME_NAME,
  SAMPLE_QUESTIONS,
  SAMPLE_SPONSORS,
  SAMPLE_WINNER_NAMES,
} from './game-mock-samples';

const TIME_ZONE = 'Asia/Damascus';
const MILLISECONDS_PER_DAY = 24 * 60 * 60 * 1000;
/** 18:00 in Damascus. */
const START_HOUR_UTC = 15;
const FIRST_ROUND = 81;
const FINISHED_GAME_COUNT = 20;
const DAYS_BETWEEN_GAMES = 3;
const SCHEDULED_DAYS_AHEAD = [4, 8, 12];
const DRAFT_DAYS_AHEAD = 20;
const WINNERS_PER_GAME = 4;
const VOTE_SECONDS = 10;

function startOn(now: Date, daysFromNow: number): string {
  const day = new Date(now.getTime() + daysFromNow * MILLISECONDS_PER_DAY);
  day.setUTCHours(START_HOUR_UTC, 0, 0, 0);
  return day.toISOString();
}

function prizeOf(round: number): GamePrize {
  const isVoucher = round % 3 === 0;
  return {
    kind: isVoucher ? 'voucher' : 'cash',
    value: { amount: 50000, currency: 'SYP' },
    sponsorName: isVoucher ? SAMPLE_SPONSORS[round % SAMPLE_SPONSORS.length] : null,
    maxWinnerCount: WINNERS_PER_GAME,
  };
}

function seedGame(round: number, startsAt: string, status: GameStatus): GameDetail {
  const isFinished = status === 'finished';
  const id = `game-${round}`;
  return {
    id,
    name: SAMPLE_GAME_NAME,
    roundNumber: round,
    startsAt,
    timeZone: TIME_ZONE,
    description: 'صوّت مع الأغلبية واربح جوائز',
    voteSeconds: VOTE_SECONDS,
    questionCount: SAMPLE_QUESTIONS.length,
    participantCount: isFinished || status === 'active' ? 150 + ((round * 37) % 170) : 0,
    prize: prizeOf(round),
    status,
    questions: SAMPLE_QUESTIONS.map((question, index) => ({
      id: `${id}-q${index + 1}`,
      text: question.text,
      options: question.options.map((text, optionIndex) => ({
        id: `${id}-q${index + 1}-o${optionIndex + 1}`,
        text,
        voteCount: isFinished ? 30 + ((round * 7 + index * 13 + optionIndex * 41) % 140) : null,
      })),
    })),
    winnerCount: 0,
    deliveredPrizeCount: 0,
  };
}

function seedWinners(game: GameDetail): GameWinner[] {
  const { prize, roundNumber: round } = game;
  return Array.from({ length: WINNERS_PER_GAME }, (_, index) => ({
    id: `${game.id}-winner-${index + 1}`,
    game: { id: game.id, name: game.name, roundNumber: round },
    user: { id: `user-${(round + index) % 40}`, name: SAMPLE_WINNER_NAMES[(round + index) % 10] },
    phone:
      index === 3 && round % 2 === 0 ? null : `09336${String(round * 10 + index).padStart(5, '0')}`,
    email: index === 3 && round % 2 === 0 ? `winner${round}@mapmob.com` : null,
    prize: {
      kind: prize.kind,
      value: { ...prize.value, amount: prize.value.amount / WINNERS_PER_GAME },
      sponsorName: prize.sponsorName,
    },
    wonOn: toZonedSchedule(game.startsAt, game.timeZone).day,
    deliveryStatus: (round + index) % 3 === 0 ? 'pending' : 'delivered',
  }));
}

/** Built around `now`, so there is always a finished history and a game still to come. */
export function buildGameMockSeed(now: Date): GameMockSeed {
  const finished = Array.from({ length: FINISHED_GAME_COUNT }, (_, index) => {
    const daysAgo = (FINISHED_GAME_COUNT - index) * DAYS_BETWEEN_GAMES;
    return seedGame(FIRST_ROUND + index, startOn(now, -daysAgo), 'finished');
  });
  let round = FIRST_ROUND + FINISHED_GAME_COUNT;
  const active = seedGame(round++, new Date(now.getTime() - 60_000).toISOString(), 'active');
  const scheduled = SCHEDULED_DAYS_AHEAD.map((days) =>
    seedGame(round++, startOn(now, days), 'scheduled'),
  );
  const draft = seedGame(round, startOn(now, DRAFT_DAYS_AHEAD), 'draft');
  return {
    games: [...finished, active, ...scheduled, draft],
    winners: finished.flatMap(seedWinners),
  };
}
