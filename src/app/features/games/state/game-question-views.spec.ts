import { GameQuestion } from '../models/game-question';
import { toGameQuestionViews } from './game-question-views';

const VOTED: GameQuestion = {
  id: 'question-1',
  text: 'ما المشروب الذي يفضله معظم الأشخاص في الصباح؟',
  options: [
    { id: 'coffee', text: 'القهوة', voteCount: 124 },
    { id: 'tea', text: 'الشاي', voteCount: 51 },
  ],
};

describe('toGameQuestionViews', () => {
  it('names each question by its order and gives it the vote time', () => {
    const views = toGameQuestionViews([VOTED, { ...VOTED, id: 'question-2' }], 10);
    expect(views.map((view) => view.ordinalLabel)).toEqual(['السؤال الأول', 'السؤال الثاني']);
    expect(views[0].number).toBe(1);
    expect(views[0].voteSecondsText).toBe('10 ثوانٍ');
  });

  it('falls back to the number past the tenth question', () => {
    const questions = Array.from({ length: 11 }, (_, index) => ({ ...VOTED, id: `q-${index}` }));
    expect(toGameQuestionViews(questions, 10)[10].ordinalLabel).toBe('السؤال 11');
  });

  it('shares the votes out and marks the majority choice', () => {
    const [coffee, tea] = toGameQuestionViews([VOTED], 10)[0].options;
    expect(coffee).toEqual({
      id: 'coffee',
      letter: 'أ',
      text: 'القهوة',
      isLeading: true,
      percent: 71,
      percentText: '71%',
      votesText: '(124 صوت)',
    });
    expect(tea.letter).toBe('ب');
    expect(tea.isLeading).toBe(false);
    expect(tea.percent).toBe(29);
  });

  it('shows no results before anyone voted', () => {
    const question: GameQuestion = {
      ...VOTED,
      options: VOTED.options.map((option) => ({ ...option, voteCount: null })),
    };
    const view = toGameQuestionViews([question], 10)[0];
    expect(view.hasResults).toBe(false);
    expect(view.options.every((option) => !option.isLeading)).toBe(true);
  });
});
