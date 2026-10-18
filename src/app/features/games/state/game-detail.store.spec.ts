import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GameRepository } from '../data/game.repository';
import { WinnerQuery } from '../models/winner-query';
import { buildGameDetail, buildWinner } from '../testing/game-fixture';
import { GameDetailStore } from './game-detail.store';

const SCHEDULED = buildGameDetail();
const FINISHED = buildGameDetail({
  id: 'game-99',
  status: 'finished',
  questions: [...SCHEDULED.questions, { ...SCHEDULED.questions[0], id: 'question-2' }],
});
const FILE = new Blob(['csv']);

function createStore(overrides: Partial<GameRepository> = {}) {
  const winnerQueries: WinnerQuery[] = [];
  const exports: WinnerQuery[] = [];
  const repository: Partial<GameRepository> = {
    getGameDetail: (id) => of(id === FINISHED.id ? FINISHED : SCHEDULED),
    getWinners: (query) => {
      winnerQueries.push(query);
      return of({ items: [buildWinner()], totalCount: 1 });
    },
    exportWinners: (query) => {
      exports.push(query);
      return of(FILE);
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [GameDetailStore, { provide: GameRepository, useValue: repository }],
  });
  return { store: TestBed.inject(GameDetailStore), winnerQueries, exports };
}

describe('GameDetailStore', () => {
  it('opens a game that has not finished on its questions, with the first one open', () => {
    const { store, winnerQueries } = createStore();

    store.open(SCHEDULED.id);

    expect(store.isOpen()).toBe(true);
    expect(store.view()?.title).toBe('الأكثرية والأقلية — الجولة #104');
    expect(store.tab()).toBe('questions');
    expect(store.tabs().map((tab) => tab.value)).toEqual(['questions']);
    expect(store.expandedQuestionIds()).toEqual(['question-1']);
    expect(winnerQueries).toEqual([]);
  });

  it('opens a finished game on its winners and loads them all', () => {
    const { store, winnerQueries } = createStore();

    store.open(FINISHED.id);

    expect(store.tab()).toBe('winners');
    expect(store.tabs().map((tab) => tab.value)).toEqual(['questions', 'winners']);
    expect(winnerQueries).toEqual([{ pageIndex: 0, pageSize: 100, gameId: 'game-99' }]);
    expect(store.winnerRows()).toHaveLength(1);
  });

  it('can open straight on the questions of a finished game', () => {
    const { store } = createStore();
    store.open(FINISHED.id, 'questions');
    expect(store.tab()).toBe('questions');
  });

  it('folds and unfolds a question', () => {
    const { store } = createStore();
    store.open(FINISHED.id);

    store.toggleQuestion('question-2');
    store.toggleQuestion('question-1');

    expect(store.expandedQuestionIds()).toEqual(['question-2']);
  });

  it('searches the winners of the open game', () => {
    const { store, winnerQueries } = createStore();
    store.open(FINISHED.id);

    store.setWinnerSearch('أحمد');

    expect(winnerQueries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 100,
      gameId: 'game-99',
      search: 'أحمد',
    });
  });

  it('exports the winners of the open game', async () => {
    const { store, exports } = createStore();
    store.open(FINISHED.id);

    expect(await store.exportWinners()).toBe(FILE);
    expect(exports[0].gameId).toBe('game-99');
  });

  it('keeps the error when the game cannot load, and can try again', () => {
    let calls = 0;
    const { store } = createStore({
      getGameDetail: () => (calls++ === 0 ? throwError(() => new Error('تعذر')) : of(SCHEDULED)),
    });

    store.open(SCHEDULED.id);
    expect(store.error()).toBe('تعذر');

    store.retry();
    expect(store.view()).not.toBeNull();
  });

  it('forgets everything on close', () => {
    const { store } = createStore();
    store.open(FINISHED.id);

    store.close();

    expect(store.isOpen()).toBe(false);
    expect(store.view()).toBeNull();
    expect(store.winnerRows()).toEqual([]);
  });
});
