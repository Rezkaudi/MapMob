import { formatArabicCount } from '../../../shared/formatting/arabic-count';
import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { CURRENCY_SYMBOLS } from '../../../shared/money/currency-symbols';
import { QUESTION_WORDS, WINNER_WORDS } from '../models/game-count-words';
import { GameDetail } from '../models/game-detail';
import { GameDetailHighlight, GameDetailTiles, GameDetailView } from '../models/game-detail-view';
import { GAME_STATUS_LABELS } from '../models/game-status';
import { PRIZE_KIND_LABELS } from '../models/prize-kind';
import { toGameQuestionViews } from './game-question-views';
import { formatGameClock, formatGameDay } from './game-schedule-text';
import { GAME_STATUS_PILL_CLASSES, canChangeGame } from './game-status-pill';
import { formatGameTitle } from './game-title';
import { formatPrizeValue } from './prize-text';

function highlightOf({ prize }: GameDetail): GameDetailHighlight {
  if (prize.kind === 'voucher') {
    return { label: 'الجهة المقدمة للجائزة', value: prize.sponsorName ?? '' };
  }
  return { label: 'القيمة الإجمالية المرصودة:', value: formatPrizeValue(prize.value) };
}

function tilesOf(detail: GameDetail): GameDetailTiles {
  const { value } = detail.prize;
  return {
    participants: formatGroupedNumber(detail.participantCount),
    winners: formatGroupedNumber(detail.winnerCount),
    prizeAmount: formatGroupedNumber(value.amount),
    prizeCurrency: CURRENCY_SYMBOLS[value.currency],
    delivered: formatGroupedNumber(detail.deliveredPrizeCount),
    deliveredOutOf: `/${formatGroupedNumber(detail.winnerCount)}`,
  };
}

export function toGameDetailView(detail: GameDetail): GameDetailView {
  const { startsAt, timeZone, status } = detail;
  return {
    title: formatGameTitle(detail),
    dayText: formatGameDay(startsAt, timeZone),
    clockText: formatGameClock(startsAt, timeZone),
    statusLabel: GAME_STATUS_LABELS[status],
    pillClass: GAME_STATUS_PILL_CLASSES[status],
    questionCountText: formatArabicCount(detail.questionCount, QUESTION_WORDS),
    prizeKindLabel: PRIZE_KIND_LABELS[detail.prize.kind],
    highlight: highlightOf(detail),
    isFinished: status === 'finished',
    canChange: canChangeGame(status),
    tiles: tilesOf(detail),
    winnerCountText: formatArabicCount(detail.winnerCount, WINNER_WORDS),
    listedQuestionCountText: formatArabicCount(detail.questions.length, QUESTION_WORDS),
    questions: toGameQuestionViews(detail.questions, detail.voteSeconds),
  };
}
