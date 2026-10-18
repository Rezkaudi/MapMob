import { TestBed } from '@angular/core/testing';
import { GameQuestion } from '../../models/game-question';
import { toGameQuestionViews } from '../../state/game-question-views';
import { GameQuestionList } from './game-question-list';

const VOTED: GameQuestion = {
  id: 'q1',
  text: 'ما المشروب الذي يفضله معظم الأشخاص في الصباح؟',
  options: [
    { id: 'coffee', text: 'القهوة', voteCount: 124 },
    { id: 'tea', text: 'الشاي', voteCount: 51 },
  ],
};

function render(expandedIds: readonly string[], question: GameQuestion = VOTED) {
  const fixture = TestBed.createComponent(GameQuestionList);
  fixture.componentRef.setInput(
    'questions',
    toGameQuestionViews([question, { ...question, id: 'q2' }], 10),
  );
  fixture.componentRef.setInput('countText', '10 أسئلة');
  fixture.componentRef.setInput('expandedIds', expandedIds);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('GameQuestionList', () => {
  it('heads the list with its count', () => {
    const { element } = render([]);
    expect(element.querySelector('h3')?.textContent?.trim()).toBe('أسئلة و أجوبة اللعبة');
    expect(element.querySelector('[data-role="count"]')?.textContent?.trim()).toBe('10 أسئلة');
  });

  it('opens only the expanded questions and draws the results with the majority marked', () => {
    const { element } = render(['q1']);
    const items = element.querySelectorAll('[data-role="question"]');
    expect(items[0].querySelector('button')?.getAttribute('aria-expanded')).toBe('true');
    expect(items[1].querySelector('[data-role="options"]')).toBeNull();
    const options = items[0].querySelectorAll('[data-role="option"]');
    expect(options[0].getAttribute('data-leading')).toBe('true');
    expect(options[0].textContent).toContain('71%');
    expect(options[0].textContent).toContain('(124 صوت)');
    expect((options[0].querySelector('[data-role="bar-fill"]') as HTMLElement).style.width).toBe(
      '71%',
    );
  });

  it('leaves the bars out before anyone voted', () => {
    const question = { ...VOTED, options: VOTED.options.map((o) => ({ ...o, voteCount: null })) };
    const { element } = render(['q1'], question);
    expect(element.querySelector('[data-role="bar-fill"]')).toBeNull();
    expect(element.querySelector('[data-role="option"]')?.textContent).toContain('القهوة');
  });

  it('tells which question was folded or unfolded', () => {
    const { fixture, element } = render([]);
    let toggled = '';
    fixture.componentInstance.toggle.subscribe((id) => (toggled = id));
    (element.querySelectorAll('[data-role="question"] button')[1] as HTMLButtonElement).click();
    expect(toggled).toBe('q2');
  });
});
