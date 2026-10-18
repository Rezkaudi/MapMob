import { buildGameDetail } from '../testing/game-fixture';
import { toGameDraft, toGameFormValue } from './game-draft-mapping';
import { GameFormValue } from './game-form-group';

const VALUE: GameFormValue = {
  name: '  الأكثرية والأقلية ',
  description: '  ',
  startsOn: '2026-10-15',
  startTime: '18:00',
  timeZone: 'Asia/Damascus',
  voteSeconds: 10,
  questions: [{ text: ' ما المشروب؟ ', firstOption: 'القهوة', secondOption: 'الشاي' }],
  prizeKind: 'cash',
  currency: 'SYP',
  prizeAmount: 50000,
  sponsorName: 'كافية النور',
  maxWinnerCount: 10,
};

describe('game draft mapping', () => {
  it('turns the form into what the server takes', () => {
    expect(toGameDraft(VALUE, 'scheduled')).toEqual({
      name: 'الأكثرية والأقلية',
      description: null,
      startsAt: '2026-10-15T18:00:00+03:00',
      timeZone: 'Asia/Damascus',
      voteSeconds: 10,
      questions: [{ text: 'ما المشروب؟', options: ['القهوة', 'الشاي'] }],
      prize: {
        kind: 'cash',
        value: { amount: 50000, currency: 'SYP' },
        sponsorName: null,
        maxWinnerCount: 10,
      },
      status: 'scheduled',
    });
  });

  it('keeps the sponsor of a voucher', () => {
    const draft = toGameDraft({ ...VALUE, prizeKind: 'voucher' }, 'draft');
    expect(draft.prize.sponsorName).toBe('كافية النور');
    expect(draft.status).toBe('draft');
  });

  it('fills the form from a saved game, in its own time zone', () => {
    const value = toGameFormValue(buildGameDetail());
    expect(value).toMatchObject({
      name: 'الأكثرية والأقلية',
      description: 'صوت مع الأغلبية واربح جوائز',
      startsOn: '2026-10-15',
      startTime: '18:00',
      voteSeconds: 10,
      prizeAmount: 50000,
      sponsorName: '',
    });
    expect(value.questions).toEqual([
      {
        text: 'ما المشروب الذي يفضله معظم الأشخاص في الصباح؟',
        firstOption: 'القهوة',
        secondOption: 'الشاي',
      },
    ]);
  });
});
