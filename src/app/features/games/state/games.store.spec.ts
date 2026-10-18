import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { GameRepository } from '../data/game.repository';
import { GamePage } from '../models/game-page';
import { GameQuery } from '../models/game-query';
import { buildGame, buildSummary } from '../testing/game-fixture';
import { GamesStore } from './games.store';

const NOW = new Date('2026-10-11T09:00:00.000Z');
const SCHEDULED = buildGame();
const FINISHED = buildGame({ id: 'game-99', roundNumber: 99, status: 'finished' });
const PAGE: GamePage = { items: [SCHEDULED, FINISHED], totalCount: 7 };

function createStore(overrides: Partial<GameRepository> = {}) {
  const queries: GameQuery[] = [];
  const repository: Partial<GameRepository> = {
    getGames: (query) => {
      queries.push(query);
      return of(PAGE);
    },
    getSummary: vi.fn(() => of(buildSummary())),
    deleteGame: vi.fn((): Observable<void> => of(undefined)),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      GamesStore,
      { provide: GameRepository, useValue: repository },
      { provide: CLOCK, useValue: () => NOW },
    ],
  });
  return { store: TestBed.inject(GamesStore), queries, repository };
}

describe('GamesStore', () => {
  it('loads three games a page, as the frame draws them', () => {
    const { store, queries } = createStore();

    store.loadGames();

    expect(queries).toEqual([{ pageIndex: 0, pageSize: 3 }]);
    expect(store.rows().map((row) => row.game)).toEqual([SCHEDULED, FINISHED]);
    expect(store.totalCount()).toBe(7);
  });

  it('keeps the error when the page cannot load', () => {
    const { store } = createStore({ getGames: () => throwError(() => new Error('تعذر التحميل')) });

    store.loadGames();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('turns the summary into the cards, the chips and the banner', () => {
    const { store } = createStore();
    expect(store.upcomingGame()).toBeNull();

    store.loadSummary();

    expect(store.statCards().map((card) => card.value)).toEqual(['120', '120', '25', '20']);
    expect(store.statusChips().map((chip) => chip.count)).toEqual([120, 12, 20]);
    expect(store.upcomingGame()?.scheduleText).toBe('15 أكتوبر 2026 — 18:00 (بعد 4 أيام)');
  });

  it('searches, sorts and filters from the first page', () => {
    const { store, queries } = createStore();
    store.changePage(2);

    store.setSearch('104');
    store.setSort('oldest');
    store.setStatusFilter('finished');

    expect(queries.at(-1)).toEqual({
      pageIndex: 0,
      pageSize: 3,
      search: '104',
      sort: 'oldest',
      status: 'finished',
    });
    expect(store.selectedChip()).toBe('finished');
  });

  it('says why the table is empty', () => {
    const { store } = createStore({ getGames: () => of({ items: [], totalCount: 0 }) });
    store.loadGames();
    expect(store.emptyMessage()).toBe('لا توجد ألعاب حتى الآن');

    store.setStatusFilter('scheduled');
    expect(store.emptyMessage()).toBe('لا توجد ألعاب بهذه الحالة');

    store.setSearch('999');
    expect(store.emptyMessage()).toBe('لا توجد نتائج مطابقة لبحثك');
  });

  it('asks before deleting, then deletes and reloads the table and cards', async () => {
    const { store, repository } = createStore();

    store.askToDelete(SCHEDULED);
    expect(store.deleteCopy()?.title).toBe('حذف اللعبة');

    await store.confirmDelete();

    expect(repository.deleteGame).toHaveBeenCalledWith('game-104');
    expect(repository.getSummary).toHaveBeenCalled();
    expect(store.pendingDelete()).toBeNull();
  });

  it('keeps the question open when the delete is refused', async () => {
    const { store } = createStore({
      deleteGame: () => throwError(() => new Error('انتهت هذه اللعبة')),
    });

    store.askToDelete(SCHEDULED);
    await store.confirmDelete();

    expect(store.pendingDelete()).toEqual(SCHEDULED);
    expect(store.saveError()).toBe('انتهت هذه اللعبة');
  });
});
