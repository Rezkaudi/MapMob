import { GameDraft } from '../models/game-draft';
import { buildGameDetail, buildWinner } from '../testing/game-fixture';
import { GameMockDatabase } from './game-mock-database';

const NOW = new Date('2026-10-11T09:00:00.000Z');

const DRAFT: GameDraft = {
  name: 'لعبة جديدة',
  description: null,
  startsAt: '2026-11-01T18:00:00+03:00',
  timeZone: 'Asia/Damascus',
  voteSeconds: 15,
  questions: [{ text: 'سؤال؟', options: ['نعم', 'لا'] }],
  prize: {
    kind: 'cash',
    value: { amount: 1000, currency: 'SYP' },
    sponsorName: null,
    maxWinnerCount: 5,
  },
  status: 'scheduled',
};

function openDatabase(): GameMockDatabase {
  const finished = buildGameDetail({
    id: 'finished',
    roundNumber: 100,
    startsAt: '2026-10-01T15:00:00.000Z',
    status: 'finished',
    participantCount: 50,
  });
  const later = buildGameDetail({
    id: 'later',
    roundNumber: 102,
    startsAt: '2026-10-20T15:00:00.000Z',
  });
  const sooner = buildGameDetail({
    id: 'sooner',
    roundNumber: 101,
    startsAt: '2026-10-15T15:00:00.000Z',
  });
  const winners = [
    buildWinner({ id: 'w1', game: { id: 'finished', name: 'x', roundNumber: 100 } }),
    buildWinner({
      id: 'w2',
      game: { id: 'finished', name: 'x', roundNumber: 100 },
      deliveryStatus: 'pending',
    }),
  ];
  return new GameMockDatabase({ games: [finished, later, sooner], winners }, () => NOW);
}

describe('GameMockDatabase', () => {
  it('pages the games as table rows', () => {
    const page = openDatabase().page({ pageIndex: 0, pageSize: 2 });
    expect(page.totalCount).toBe(3);
    expect(page.items.map((game) => game.id)).toEqual(['later', 'sooner']);
    expect('questions' in page.items[0]).toBe(false);
  });

  it('counts the cards and picks the nearest game still to come', () => {
    const summary = openDatabase().summary();
    expect(summary).toMatchObject({
      gameCount: 3,
      scheduledCount: 2,
      finishedCount: 1,
      participantCount: 50 + 214 + 214,
      winnerCount: 2,
      deliveredPrizeCount: 1,
    });
    expect(summary.upcomingGame?.id).toBe('sooner');
  });

  it('adds the winner numbers to a detail', () => {
    const detail = openDatabase().detail('finished');
    expect(detail.winnerCount).toBe(2);
    expect(detail.deliveredPrizeCount).toBe(1);
  });

  it('gives a new game the next round number', () => {
    const database = openDatabase();
    const created = database.create(DRAFT);
    expect(created.roundNumber).toBe(103);
    expect(created.status).toBe('scheduled');
    expect(created.questionCount).toBe(1);
    expect(database.detail(created.id).questions[0].options.map((option) => option.text)).toEqual([
      'نعم',
      'لا',
    ]);
  });

  it('saves a draft as a draft', () => {
    expect(openDatabase().create({ ...DRAFT, status: 'draft' }).status).toBe('draft');
  });

  it('updates a game that has not finished, keeping its round', () => {
    const database = openDatabase();
    database.update('later', { ...DRAFT, name: 'اسم جديد' });
    const detail = database.detail('later');
    expect(detail.name).toBe('اسم جديد');
    expect(detail.roundNumber).toBe(102);
  });

  it('refuses to change or delete a finished game', () => {
    const database = openDatabase();
    expect(() => database.update('finished', DRAFT)).toThrowError(
      'انتهت هذه اللعبة ولا يمكن تعديلها أو حذفها.',
    );
    expect(() => database.remove('finished')).toThrowError();
  });

  it('deletes a game', () => {
    const database = openDatabase();
    database.remove('later');
    expect(database.page({ pageIndex: 0, pageSize: 10 }).totalCount).toBe(2);
  });

  it('pages the winners and records a delivery', () => {
    const database = openDatabase();
    database.setDelivery('w2', 'delivered');
    expect(
      database
        .winners({ pageIndex: 0, pageSize: 10 })
        .items.every((winner) => winner.deliveryStatus === 'delivered'),
    ).toBe(true);
    expect(database.summary().deliveredPrizeCount).toBe(2);
  });
});
