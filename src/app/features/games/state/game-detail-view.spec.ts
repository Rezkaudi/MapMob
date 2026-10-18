import { buildGameDetail } from '../testing/game-fixture';
import { toGameDetailView } from './game-detail-view';

describe('toGameDetailView', () => {
  it('fills the summary box of a cash game with its total value', () => {
    const view = toGameDetailView(buildGameDetail({ status: 'finished' }));
    expect(view.title).toBe('الأكثرية والأقلية — الجولة #104');
    expect(view.dayText).toBe('15 أكتوبر 2026');
    expect(view.clockText).toBe('18:00');
    expect(view.questionCountText).toBe('12 سؤالاً');
    expect(view.prizeKindLabel).toBe('جائزة مالية');
    expect(view.highlight).toEqual({ label: 'القيمة الإجمالية المرصودة:', value: '50,000 ل.س' });
    expect(view.statusLabel).toBe('منتهية');
    expect(view.pillClass).toBe('bg-closed');
  });

  it('names who gives a voucher instead of a value', () => {
    const detail = buildGameDetail();
    const view = toGameDetailView({
      ...detail,
      prize: { ...detail.prize, kind: 'voucher', sponsorName: 'كافية النور' },
    });
    expect(view.prizeKindLabel).toBe('قسيمة شرائية');
    expect(view.highlight).toEqual({ label: 'الجهة المقدمة للجائزة', value: 'كافية النور' });
  });

  it('gives a finished game its numbers and winners tab, and nothing to change', () => {
    const view = toGameDetailView(
      buildGameDetail({ status: 'finished', winnerCount: 4, deliveredPrizeCount: 2 }),
    );
    expect(view.isFinished).toBe(true);
    expect(view.canChange).toBe(false);
    expect(view.tiles).toEqual({
      participants: '214',
      winners: '4',
      prizeAmount: '50,000',
      prizeCurrency: 'ل.س',
      delivered: '2',
      deliveredOutOf: '/4',
    });
    expect(view.winnerCountText).toBe('4 فائزين');
  });

  it('lets a game that has not finished be edited', () => {
    const view = toGameDetailView(buildGameDetail({ status: 'scheduled' }));
    expect(view.isFinished).toBe(false);
    expect(view.canChange).toBe(true);
  });

  it('counts the questions it lists', () => {
    expect(toGameDetailView(buildGameDetail()).listedQuestionCountText).toBe('سؤال واحد');
  });
});
