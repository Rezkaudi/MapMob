import { GameDetail } from '../models/game-detail';
import { GameDraft } from '../models/game-draft';
import { GameEntry } from '../models/game-entry';

/** What a new or edited game keeps from the server's side of the record. */
export interface GameRecordKeys {
  readonly id: string;
  readonly roundNumber: number;
  readonly participantCount: number;
}

export function toGameEntry(detail: GameDetail): GameEntry {
  const {
    description: _description,
    voteSeconds: _voteSeconds,
    questions: _questions,
    winnerCount: _winnerCount,
    deliveredPrizeCount: _deliveredPrizeCount,
    ...entry
  } = detail;
  return entry;
}

export function toGameRecord(draft: GameDraft, keys: GameRecordKeys): GameDetail {
  return {
    ...keys,
    name: draft.name,
    description: draft.description,
    startsAt: new Date(draft.startsAt).toISOString(),
    timeZone: draft.timeZone,
    voteSeconds: draft.voteSeconds,
    questionCount: draft.questions.length,
    prize: draft.prize,
    status: draft.status,
    questions: draft.questions.map((question, questionIndex) => ({
      id: `${keys.id}-q${questionIndex + 1}`,
      text: question.text,
      options: question.options.map((text, optionIndex) => ({
        id: `${keys.id}-q${questionIndex + 1}-o${optionIndex + 1}`,
        text,
        voteCount: null,
      })),
    })),
    winnerCount: 0,
    deliveredPrizeCount: 0,
  };
}
