import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GameRepository } from '../data/game.repository';
import { WinnerQuery } from '../models/winner-query';
import { buildWinner } from '../testing/game-fixture';
import { WinnersStore } from './winners.store';

const DELIVERED = buildWinner();
const PENDING = buildWinner({ id: 'winner-2', deliveryStatus: 'pending' });
const FILE = new Blob(['csv']);

function createStore(overrides: Partial<GameRepository> = {}) {
  const queries: WinnerQuery[] = [];
  const exports: WinnerQuery[] = [];
  const repository: Partial<GameRepository> = {
    getWinners: (query) => {
      queries.push(query);
      return of({ items: [DELIVERED, PENDING], totalCount: 9 });
    },
    setPrizeDelivery: vi.fn(() => of(undefined)),
    exportWinners: (query) => {
      exports.push(query);
      return of(FILE);
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [WinnersStore, { provide: GameRepository, useValue: repository }],
  });
  return { store: TestBed.inject(WinnersStore), queries, exports, repository };
}

describe('WinnersStore', () => {
  it('loads four winners a page, as the frame draws them', () => {
    const { store, queries } = createStore();

    store.loadWinners();

    expect(queries).toEqual([{ pageIndex: 0, pageSize: 4 }]);
    expect(store.rows().map((row) => row.winner)).toEqual([DELIVERED, PENDING]);
    expect(store.totalCount()).toBe(9);
  });

  it('searches and sorts from the first page', () => {
    const { store, queries } = createStore();
    store.changePage(1);

    store.setSearch('سارة');
    store.setSort('name');

    expect(queries.at(-1)).toEqual({ pageIndex: 0, pageSize: 4, search: 'سارة', sort: 'name' });
  });

  it('flips a waiting prize to delivered after asking, then reloads', async () => {
    const { store, repository, queries } = createStore();
    const onChanged = vi.fn();

    store.askToChangeDelivery(PENDING);
    expect(store.deliveryCopy()?.confirmLabel).toBe('تم التسليم');
    await store.confirmDeliveryChange(onChanged);

    expect(repository.setPrizeDelivery).toHaveBeenCalledWith('winner-2', 'delivered');
    expect(store.pendingDeliveryChange()).toBeNull();
    expect(queries).toHaveLength(1);
    expect(onChanged).toHaveBeenCalled();
  });

  it('keeps the question open when the change is refused', async () => {
    const { store } = createStore({ setPrizeDelivery: () => throwError(() => new Error('رفض')) });

    store.askToChangeDelivery(DELIVERED);
    await store.confirmDeliveryChange();

    expect(store.pendingDeliveryChange()).toEqual(DELIVERED);
    expect(store.saveError()).toBe('رفض');
  });

  it('exports every winner the search matches', async () => {
    const { store, exports } = createStore();
    store.setSearch('0933');

    const file = await store.exportWinners();

    expect(file).toBe(FILE);
    expect(exports).toEqual([{ pageIndex: 0, pageSize: 4, search: '0933' }]);
    expect(store.isExporting()).toBe(false);
  });
});
