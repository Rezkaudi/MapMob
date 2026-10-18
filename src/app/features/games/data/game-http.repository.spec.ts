import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { GameDraft } from '../models/game-draft';
import { buildGame, buildGameDetail, buildSummary, buildWinner } from '../testing/game-fixture';
import { GameHttpRepository } from './game-http.repository';

const BASE = 'https://api.test';
const GAMES_URL = `${BASE}/admin/games`;

const DRAFT: GameDraft = {
  name: 'لعبة',
  description: null,
  startsAt: '2026-11-01T18:00:00+03:00',
  timeZone: 'Asia/Damascus',
  voteSeconds: 10,
  questions: [{ text: 'سؤال؟', options: ['نعم', 'لا'] }],
  prize: {
    kind: 'cash',
    value: { amount: 1000, currency: 'SYP' },
    sponsorName: null,
    maxWinnerCount: 3,
  },
  status: 'scheduled',
};

describe('GameHttpRepository', () => {
  let repository: GameHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE },
        GameHttpRepository,
      ],
    });
    repository = TestBed.inject(GameHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads a page of games with the filters as query params', async () => {
    const page = firstValueFrom(
      repository.getGames({ pageIndex: 0, pageSize: 3, status: 'scheduled', search: '104' }),
    );
    const request = http.expectOne((call) => call.url === GAMES_URL);
    expect(request.request.params.get('status')).toBe('scheduled');
    expect(request.request.params.get('search')).toBe('104');
    expect(request.request.params.get('pageSize')).toBe('3');
    request.flush({ items: [buildGame()], totalCount: 1 });
    expect((await page).totalCount).toBe(1);
  });

  it('reads the summary and one game', async () => {
    const summary = firstValueFrom(repository.getSummary());
    http.expectOne(`${GAMES_URL}/summary`).flush(buildSummary());
    expect((await summary).gameCount).toBe(120);

    const detail = firstValueFrom(repository.getGameDetail('game-104'));
    http.expectOne(`${GAMES_URL}/game-104`).flush(buildGameDetail());
    expect((await detail).questions).toHaveLength(1);
  });

  it('creates, updates and deletes a game', async () => {
    const created = firstValueFrom(repository.createGame(DRAFT));
    const post = http.expectOne(GAMES_URL);
    expect(post.request.method).toBe('POST');
    expect(post.request.body).toEqual(DRAFT);
    post.flush(buildGame());
    await created;

    const updated = firstValueFrom(repository.updateGame('game-104', DRAFT));
    const put = http.expectOne(`${GAMES_URL}/game-104`);
    expect(put.request.method).toBe('PUT');
    put.flush(buildGame());
    await updated;

    const deleted = firstValueFrom(repository.deleteGame('game-104'));
    const remove = http.expectOne(`${GAMES_URL}/game-104`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush(null, { status: 204, statusText: 'No Content' });
    await deleted;
  });

  it('reads the winners and records a delivery', async () => {
    const winners = firstValueFrom(
      repository.getWinners({ pageIndex: 0, pageSize: 4, gameId: 'game-104' }),
    );
    const list = http.expectOne((call) => call.url === `${GAMES_URL}/winners`);
    expect(list.request.params.get('gameId')).toBe('game-104');
    list.flush({ items: [buildWinner()], totalCount: 1 });
    expect((await winners).items).toHaveLength(1);

    const delivered = firstValueFrom(repository.setPrizeDelivery('winner-1', 'delivered'));
    const patch = http.expectOne(`${GAMES_URL}/winners/winner-1/delivery`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ deliveryStatus: 'delivered' });
    patch.flush(buildWinner());
    await delivered;
  });

  it('downloads the winners file without paging', async () => {
    const file = firstValueFrom(
      repository.exportWinners({ pageIndex: 1, pageSize: 4, search: 'سارة' }),
    );
    const request = http.expectOne((call) => call.url === `${GAMES_URL}/winners/export`);
    expect(request.request.params.has('pageIndex')).toBe(false);
    expect(request.request.params.get('search')).toBe('سارة');
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['csv']));
    expect(await file).toBeInstanceOf(Blob);
  });
});
