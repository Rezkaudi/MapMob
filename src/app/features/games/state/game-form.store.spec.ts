import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { GameRepository } from '../data/game.repository';
import { GameDraft } from '../models/game-draft';
import { buildGame, buildGameDetail } from '../testing/game-fixture';
import { GameFormStore } from './game-form.store';

const DRAFT = { name: 'لعبة' } as GameDraft;

function createStore(overrides: Partial<GameRepository> = {}) {
  const repository: Partial<GameRepository> = {
    getGameDetail: vi.fn(() => of(buildGameDetail())),
    createGame: vi.fn(() => of(buildGame())),
    updateGame: vi.fn(() => of(buildGame())),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [GameFormStore, { provide: GameRepository, useValue: repository }],
  });
  return { store: TestBed.inject(GameFormStore), repository };
}

describe('GameFormStore', () => {
  it('is ready at once for a new game', () => {
    const { store, repository } = createStore();
    store.load(null);
    expect(store.isReady()).toBe(true);
    expect(repository.getGameDetail).not.toHaveBeenCalled();
  });

  it('loads the game it edits', () => {
    const { store } = createStore();
    store.load('game-104');
    expect(store.isReady()).toBe(true);
    expect(store.editedDetail()?.id).toBe('game-104');
  });

  it('keeps the error when the game cannot load, and can try again', () => {
    let calls = 0;
    const { store } = createStore({
      getGameDetail: () =>
        calls++ === 0 ? throwError(() => new Error('تعذر')) : of(buildGameDetail()),
    });
    store.load('game-104');
    expect(store.error()).toBe('تعذر');
    store.retry();
    expect(store.isReady()).toBe(true);
  });

  it('creates a new game and updates an edited one', async () => {
    const { store, repository } = createStore();

    expect(await store.save(null, DRAFT)).toBe(true);
    expect(repository.createGame).toHaveBeenCalledWith(DRAFT);

    expect(await store.save('game-104', DRAFT)).toBe(true);
    expect(repository.updateGame).toHaveBeenCalledWith('game-104', DRAFT);
  });

  it('reports a refused save', async () => {
    const { store } = createStore({ createGame: () => throwError(() => new Error('رفض')) });
    expect(await store.save(null, DRAFT)).toBe(false);
    expect(store.saveError()).toBe('رفض');
  });
});
