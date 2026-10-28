import { GameDraft } from '../models/game-draft';
import { buildLiveGame } from '../testing/live-game-fixture';
import { toGameDetail, toGameEntry, toLiveGameBody } from './live-game-mapping';

const DRAFT: GameDraft = {
  name: 'لعبة',
  description: null,
  startsAt: '2026-11-01T18:00:00+03:00',
  timeZone: 'Asia/Damascus',
  voteSeconds: 10,
  questions: [{ text: 'سؤال؟', options: ['نعم', 'لا'] }],
  prize: {
    kind: 'voucher',
    value: { amount: 1000, currency: 'SYP' },
    sponsorName: 'متجر',
    maxWinnerCount: 3,
  },
  status: 'scheduled',
};

describe('live game mapping', () => {
  it('turns a server game into a table row', () => {
    expect(toGameEntry(buildLiveGame())).toEqual({
      id: '9',
      name: 'الأكثرية والأقلية',
      roundNumber: 9,
      startsAt: '2026-12-01T15:00:00+00:00',
      timeZone: 'Asia/Damascus',
      questionCount: 2,
      participantCount: 0,
      prize: {
        kind: 'cash',
        value: { amount: 50000, currency: 'SYP' },
        sponsorName: null,
        maxWinnerCount: 3,
      },
      status: 'scheduled',
    });
  });

  it('reads completed as finished', () => {
    expect(toGameEntry(buildLiveGame({ status: 'completed' })).status).toBe('finished');
  });

  it('counts the questions when the list has no count', () => {
    const game = buildLiveGame({
      questions_count: undefined,
      questions: [
        { id: 1, question: 'س؟', sort_order: 0, options: [] },
        { id: 2, question: 'ص؟', sort_order: 1, options: [] },
      ],
    });
    expect(toGameEntry(game).questionCount).toBe(2);
  });

  it('turns a server game into the detail view', () => {
    const detail = toGameDetail(
      buildLiveGame({
        winners_count: 2,
        questions: [
          {
            id: 1,
            question: 'س؟',
            sort_order: 0,
            options: [
              { id: 7, option: 'نعم', is_correct: true, sort_order: 0 },
              { id: 8, option: 'لا', is_correct: false, sort_order: 1 },
            ],
          },
        ],
      }),
      1,
    );
    expect(detail.voteSeconds).toBe(10);
    expect(detail.winnerCount).toBe(2);
    expect(detail.deliveredPrizeCount).toBe(1);
    expect(detail.description).toBe('صوت مع الأغلبية');
    expect(detail.questions).toEqual([
      {
        id: '1',
        text: 'س؟',
        options: [
          { id: '7', text: 'نعم', voteCount: null },
          { id: '8', text: 'لا', voteCount: null },
        ],
      },
    ]);
  });

  it('builds the body the server saves, with the start in UTC', () => {
    expect(toLiveGameBody(DRAFT)).toEqual({
      name: 'لعبة',
      description: null,
      starts_at: '2026-11-01 15:00:00',
      timezone: 'Asia/Damascus',
      answer_time_seconds: 10,
      status: 'scheduled',
      prize_type: 'voucher',
      prize_value: 1000,
      currency_code: 'SYP',
      max_winners: 3,
      questions: [
        {
          question: 'سؤال؟',
          options: [
            { option: 'نعم', is_correct: true },
            { option: 'لا', is_correct: false },
          ],
        },
      ],
    });
  });
});
