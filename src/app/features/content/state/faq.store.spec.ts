import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { FaqRepository } from '../data/faq.repository';
import { FaqQuestionDraft } from '../models/faq-question-draft';
import { buildFaqQuestion } from '../testing/content-fixture';
import { FaqStore } from './faq.store';

const FIRST = buildFaqQuestion();
const SECOND = buildFaqQuestion({
  id: 'faq-2',
  question: 'كيف أغير المنطقة؟',
  answer: 'من الإعدادات.',
});

function createStore(overrides: Partial<FaqRepository> = {}) {
  const added: FaqQuestionDraft[] = [];
  const updated: [string, FaqQuestionDraft][] = [];
  const deleted: string[] = [];
  const repository: Partial<FaqRepository> = {
    getQuestions: () => of([FIRST, SECOND]),
    addQuestion: (draft) => {
      added.push(draft);
      return of({ id: 'faq-3', ...draft });
    },
    updateQuestion: (id, draft) => {
      updated.push([id, draft]);
      return of({ id, ...draft });
    },
    deleteQuestion: (id) => {
      deleted.push(id);
      return of(undefined);
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [FaqStore, { provide: FaqRepository, useValue: repository }],
  });
  const store = TestBed.inject(FaqStore);
  return { store, added, updated, deleted };
}

describe('FaqStore', () => {
  it('loads the questions, numbers them, and opens the first one as the design shows', () => {
    const { store } = createStore();

    store.loadQuestions();

    expect(store.rows()).toEqual([
      { question: FIRST, number: 1, isExpanded: true },
      { question: SECOND, number: 2, isExpanded: false },
    ]);
    expect(store.questionCount()).toBe(2);
    expect(store.hasNoQuestions()).toBe(false);
  });

  it('reports a failed load', () => {
    const { store } = createStore({
      getQuestions: () => throwError(() => new Error('تعذر تحميل الأسئلة')),
    });

    store.loadQuestions();

    expect(store.error()).toBe('تعذر تحميل الأسئلة');
  });

  it('opens and closes one answer, or all of them', () => {
    const { store } = createStore();
    store.loadQuestions();

    store.toggleExpanded('faq-2');
    store.toggleExpanded('faq-1');
    expect(store.rows().map((row) => row.isExpanded)).toEqual([false, true]);

    store.expandAll();
    expect(store.rows().every((row) => row.isExpanded)).toBe(true);

    store.collapseAll();
    expect(store.rows().some((row) => row.isExpanded)).toBe(false);
  });

  it('adds a question at the end and opens its answer', async () => {
    const { store, added } = createStore();
    store.loadQuestions();
    store.openAddDialog();
    expect(store.dialog()).toEqual({ mode: 'add' });

    expect(await store.saveQuestion({ question: 'جديد؟', answer: 'نعم' })).toBe(true);

    expect(added).toEqual([{ question: 'جديد؟', answer: 'نعم' }]);
    expect(store.rows().at(-1)).toEqual({
      question: { id: 'faq-3', question: 'جديد؟', answer: 'نعم' },
      number: 3,
      isExpanded: true,
    });
    expect(store.dialog()).toBeNull();
  });

  it('edits a question in place, with its number in the dialog', async () => {
    const { store, updated } = createStore();
    store.loadQuestions();
    store.openEditDialog(SECOND);
    expect(store.dialog()).toEqual({ mode: 'edit', question: SECOND, number: 2 });

    await store.saveQuestion({ question: 'معدل؟', answer: 'تم' });

    expect(updated).toEqual([['faq-2', { question: 'معدل؟', answer: 'تم' }]]);
    expect(store.rows()[1].question.question).toBe('معدل؟');
    expect(store.dialog()).toBeNull();
  });

  it('keeps the dialog open with the error when a save fails, and clears it on close', async () => {
    const { store } = createStore({
      addQuestion: (): Observable<never> => throwError(() => new Error('تعذر حفظ السؤال')),
    });
    store.loadQuestions();
    store.openAddDialog();

    expect(await store.saveQuestion({ question: 'س؟', answer: 'ج' })).toBe(false);
    expect(store.dialog()).toEqual({ mode: 'add' });
    expect(store.saveError()).toBe('تعذر حفظ السؤال');

    store.closeDialog();
    expect(store.dialog()).toBeNull();
    expect(store.saveError()).toBeNull();
  });

  it('deletes a question only after it is confirmed', async () => {
    const { store, deleted } = createStore();
    store.loadQuestions();

    store.askToDelete(FIRST);
    expect(store.pendingDeletion()).toEqual(FIRST);
    store.cancelDeletion();
    expect(store.pendingDeletion()).toBeNull();

    store.askToDelete(FIRST);
    expect(await store.confirmDeletion()).toBe(true);

    expect(deleted).toEqual(['faq-1']);
    expect(store.rows()).toEqual([{ question: SECOND, number: 1, isExpanded: false }]);
    expect(store.pendingDeletion()).toBeNull();
  });

  it('says when there are no questions', () => {
    const { store } = createStore({ getQuestions: () => of([]) });

    store.loadQuestions();

    expect(store.hasNoQuestions()).toBe(true);
  });
});
