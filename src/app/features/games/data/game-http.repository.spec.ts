import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { GameDraft } from '../models/game-draft';
import { buildLiveGame, buildLiveWinner } from '../testing/live-game-fixture';
import { GameHttpRepository } from './game-http.repository';
import { LiveGame } from './live-game';
import { LiveWinner } from './live-winner';

const BASE = 'https://api.test';
const GAMES_URL = `${BASE}/admin/games`;
const WINNERS_URL = `${GAMES_URL}/winners`;
const NOW = new Date('2026-11-01T00:00:00Z');

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

function onePage<T>(data: readonly T[]) {
  return { data, meta: { current_page: 1, last_page: 1 } };
}

describe('GameHttpRepository', () => {
  let repository: GameHttpRepository;
  let http: HttpTestingController;

  const flushGames = (games: readonly LiveGame[]) =>
    http.expectOne((call) => call.url === GAMES_URL && call.method === 'GET').flush(onePage(games));
  const flushWinners = (winners: readonly LiveWinner[]) =>
    http.expectOne((call) => call.url === WINNERS_URL).flush(onePage(winners));

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE },
        { provide: CLOCK, useValue: () => NOW },
        GameHttpRepository,
      ],
    });
    repository = TestBed.inject(GameHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads every game and filters, sorts and pages them here', async () => {
    const page = firstValueFrom(
      repository.getGames({ pageIndex: 0, pageSize: 1, status: 'scheduled', search: 'ليلة' }),
    );
    const request = http.expectOne((call) => call.url === GAMES_URL);
    expect(request.request.params.get('page')).toBe('1');
    expect(request.request.params.get('per_page')).toBe('100');
    request.flush(
      onePage([
        buildLiveGame({ id: 1, name: 'ليلة الأسئلة' }),
        buildLiveGame({ id: 2, name: 'ليلة ثانية' }),
        buildLiveGame({ id: 3, name: 'ليلة مسودة', status: 'draft' }),
        buildLiveGame({ id: 4, name: 'أخرى' }),
      ]),
    );
    const result = await page;
    expect(result.totalCount).toBe(2);
    expect(result.items).toHaveLength(1);
  });

  it('reads the summary counts from the server and the next game from the list', async () => {
    const summary = firstValueFrom(repository.getSummary());
    http
      .expectOne(`${GAMES_URL}/summary`)
      .flush({ data: { total: 2, draft: 0, scheduled: 2, active: 0, completed: 0 } });
    flushGames([buildLiveGame({ id: 7, starts_at: '2026-12-01T15:00:00+00:00' })]);
    flushWinners([buildLiveWinner({ delivery_status: 'delivered' })]);
    const result = await summary;
    expect(result.gameCount).toBe(2);
    expect(result.deliveredPrizeCount).toBe(1);
    expect(result.upcomingGame?.id).toBe('7');
  });

  it('reads one game with its delivered prizes', async () => {
    const detail = firstValueFrom(repository.getGameDetail('9'));
    http.expectOne(`${GAMES_URL}/9`).flush({ data: buildLiveGame({ winners_count: 1 }) });
    flushWinners([
      buildLiveWinner({ delivery_status: 'delivered' }),
      buildLiveWinner({ id: 5, game: { id: 2, name: 'غيرها' }, delivery_status: 'delivered' }),
    ]);
    const result = await detail;
    expect(result.id).toBe('9');
    expect(result.deliveredPrizeCount).toBe(1);
  });

  it('creates, updates and deletes a game in the server shape', async () => {
    const created = firstValueFrom(repository.createGame(DRAFT));
    const post = http.expectOne(GAMES_URL);
    expect(post.request.method).toBe('POST');
    expect(post.request.body.starts_at).toBe('2026-11-01 15:00:00');
    expect(post.request.body.questions[0].options[0].is_correct).toBe(true);
    post.flush({ data: buildLiveGame() });
    expect((await created).id).toBe('9');

    const updated = firstValueFrom(repository.updateGame('9', DRAFT));
    const put = http.expectOne(`${GAMES_URL}/9`);
    expect(put.request.method).toBe('PUT');
    expect(put.request.body.prize_type).toBe('cash');
    put.flush({ data: buildLiveGame() });
    await updated;

    const deleted = firstValueFrom(repository.deleteGame('9'));
    const remove = http.expectOne(`${GAMES_URL}/9`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush({ data: null });
    await deleted;
  });

  it('reads every winner and filters them here', async () => {
    const winners = firstValueFrom(
      repository.getWinners({ pageIndex: 0, pageSize: 4, gameId: '9' }),
    );
    flushWinners([buildLiveWinner(), buildLiveWinner({ id: 5, game: { id: 2, name: 'غيرها' } })]);
    flushGames([buildLiveGame()]);
    const result = await winners;
    expect(result.totalCount).toBe(1);
    expect(result.items[0].game.roundNumber).toBe(9);
  });

  it('records a delivery with the server field name', async () => {
    const delivered = firstValueFrom(repository.setPrizeDelivery('4', 'delivered'));
    const patch = http.expectOne(`${WINNERS_URL}/4/delivery`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ delivery_status: 'delivered' });
    patch.flush({ data: null });
    await delivered;
  });

  it('downloads the winners file from the server', async () => {
    const file = firstValueFrom(
      repository.exportWinners({ pageIndex: 1, pageSize: 4, search: 'سارة', gameId: '9' }),
    );
    const request = http.expectOne((call) => call.url === `${WINNERS_URL}/export`);
    expect(request.request.params.has('page')).toBe(false);
    expect(request.request.params.get('search')).toBe('سارة');
    expect(request.request.params.get('game_id')).toBe('9');
    expect(request.request.responseType).toBe('blob');
    request.flush(new Blob(['csv']));
    expect(await file).toBeInstanceOf(Blob);
  });
});
