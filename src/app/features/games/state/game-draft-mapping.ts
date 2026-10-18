import { GameDetail } from '../models/game-detail';
import { GameDraft, GameSavedStatus } from '../models/game-draft';
import { DEFAULT_GAME_TIME_ZONE, GAME_TIME_ZONES } from '../models/game-time-zone';
import { toGameStartsAt, toZonedSchedule } from './game-schedule-text';
import { GameFormValue } from './game-form-group';

function offsetOf(timeZone: string): string {
  return (GAME_TIME_ZONES.find((zone) => zone.id === timeZone) ?? DEFAULT_GAME_TIME_ZONE).utcOffset;
}

export function toGameDraft(value: GameFormValue, status: GameSavedStatus): GameDraft {
  const description = value.description.trim();
  return {
    name: value.name.trim(),
    description: description || null,
    startsAt: toGameStartsAt(value.startsOn, value.startTime, offsetOf(value.timeZone)),
    timeZone: value.timeZone,
    voteSeconds: Number(value.voteSeconds),
    questions: value.questions.map((question) => ({
      text: question.text.trim(),
      options: [question.firstOption.trim(), question.secondOption.trim()],
    })),
    prize: {
      kind: value.prizeKind,
      value: { amount: Number(value.prizeAmount), currency: value.currency },
      sponsorName: value.prizeKind === 'voucher' ? value.sponsorName.trim() : null,
      maxWinnerCount: Number(value.maxWinnerCount),
    },
    status,
  };
}

export function toGameFormValue(detail: GameDetail): GameFormValue {
  const { day, time } = toZonedSchedule(detail.startsAt, detail.timeZone);
  return {
    name: detail.name,
    description: detail.description ?? '',
    startsOn: day,
    startTime: time,
    timeZone: detail.timeZone,
    voteSeconds: detail.voteSeconds,
    questions: detail.questions.map((question) => ({
      text: question.text,
      firstOption: question.options[0]?.text ?? '',
      secondOption: question.options[1]?.text ?? '',
    })),
    prizeKind: detail.prize.kind,
    currency: detail.prize.value.currency,
    prizeAmount: detail.prize.value.amount,
    sponsorName: detail.prize.sponsorName ?? '',
    maxWinnerCount: detail.prize.maxWinnerCount,
  };
}
