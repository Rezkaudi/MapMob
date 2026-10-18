import { formatArabicCount } from '../../../shared/formatting/arabic-count';
import { SECOND_WORDS } from '../models/game-count-words';
import { GameOption } from '../models/game-option';
import { GameQuestion } from '../models/game-question';
import { GameOptionView, GameQuestionView } from '../models/game-question-view';

const ORDINALS = [
  'الأول',
  'الثاني',
  'الثالث',
  'الرابع',
  'الخامس',
  'السادس',
  'السابع',
  'الثامن',
  'التاسع',
  'العاشر',
];
const OPTION_LETTERS = ['أ', 'ب', 'ج', 'د'];
const FULL_PERCENT = 100;

function ordinalLabelOf(number: number): string {
  const ordinal = ORDINALS[number - 1];
  return ordinal ? `السؤال ${ordinal}` : `السؤال ${number}`;
}

function toOptionView(
  option: GameOption,
  index: number,
  totalVotes: number,
  leadingVotes: number,
): GameOptionView {
  const votes = option.voteCount ?? 0;
  const percent = totalVotes > 0 ? Math.round((votes / totalVotes) * FULL_PERCENT) : 0;
  return {
    id: option.id,
    letter: OPTION_LETTERS[index] ?? String(index + 1),
    text: option.text,
    isLeading: totalVotes > 0 && votes === leadingVotes,
    percent,
    percentText: `${percent}%`,
    votesText: `(${votes} صوت)`,
  };
}

function toQuestionView(
  question: GameQuestion,
  index: number,
  voteSeconds: number,
): GameQuestionView {
  const counts = question.options.map((option) => option.voteCount ?? 0);
  const totalVotes = counts.reduce((total, count) => total + count, 0);
  const hasResults = question.options.some((option) => option.voteCount !== null);
  const leadingVotes = Math.max(...counts);
  return {
    id: question.id,
    number: index + 1,
    ordinalLabel: ordinalLabelOf(index + 1),
    text: question.text,
    voteSecondsText: formatArabicCount(voteSeconds, SECOND_WORDS),
    hasResults,
    options: question.options.map((option, optionIndex) =>
      toOptionView(option, optionIndex, hasResults ? totalVotes : 0, leadingVotes),
    ),
  };
}

export function toGameQuestionViews(
  questions: readonly GameQuestion[],
  voteSeconds: number,
): readonly GameQuestionView[] {
  return questions.map((question, index) => toQuestionView(question, index, voteSeconds));
}
