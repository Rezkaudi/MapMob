import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';
import { GameQuestion } from '../models/game-question';
import { GameStatus } from '../models/game-status';
import { LiveGame, LiveGameQuestion, LiveGameStatus } from './live-game';
import { toServerMoment } from './live-game-moment';
import { toWonPrize } from './live-prize-mapping';

// The server keeps no player count yet.
const UNKNOWN_PARTICIPANT_COUNT = 0;

const GAME_STATUS_OF: Record<LiveGameStatus, GameStatus> = {
  draft: 'draft',
  scheduled: 'scheduled',
  active: 'active',
  completed: 'finished',
};

export function toGameEntry(game: LiveGame): GameEntry {
  return {
    id: String(game.id),
    name: game.name,
    // The server has no round number, so the id stands in for it.
    roundNumber: game.id,
    startsAt: game.starts_at,
    timeZone: game.timezone,
    questionCount: game.questions_count ?? game.questions?.length ?? 0,
    participantCount: UNKNOWN_PARTICIPANT_COUNT,
    prize: { ...toWonPrize(game.prize), maxWinnerCount: Number(game.max_winners) },
    status: GAME_STATUS_OF[game.status],
  };
}

function toGameQuestion(question: LiveGameQuestion): GameQuestion {
  return {
    id: String(question.id),
    text: question.question,
    options: question.options.map((option) => ({
      id: String(option.id),
      text: option.option,
      voteCount: null,
    })),
  };
}

export function toGameDetail(game: LiveGame, deliveredPrizeCount: number): GameDetail {
  return {
    ...toGameEntry(game),
    description: game.description,
    voteSeconds: Number(game.answer_time_seconds),
    questions: (game.questions ?? []).map(toGameQuestion),
    winnerCount: game.winners_count ?? 0,
    deliveredPrizeCount,
  };
}

// The server wants one right answer per question; a majority game has none, so the first is marked.
export function toLiveGameBody(draft: GameDraft) {
  return {
    name: draft.name,
    description: draft.description,
    starts_at: toServerMoment(draft.startsAt),
    timezone: draft.timeZone,
    answer_time_seconds: draft.voteSeconds,
    status: draft.status,
    prize_type: draft.prize.kind,
    prize_value: draft.prize.value.amount,
    currency_code: draft.prize.value.currency,
    max_winners: draft.prize.maxWinnerCount,
    questions: draft.questions.map((question) => ({
      question: question.text,
      options: question.options.map((option, index) => ({ option, is_correct: index === 0 })),
    })),
  };
}
