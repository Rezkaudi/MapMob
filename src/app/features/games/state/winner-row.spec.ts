import { buildWinner } from '../testing/game-fixture';
import { toWinnerRow } from './winner-row';

describe('toWinnerRow', () => {
  it('writes the contact, round, prize and day as the winners table shows them', () => {
    const row = toWinnerRow(buildWinner());
    expect(row.contactText).toBe('093608934');
    expect(row.roundText).toBe('#104');
    expect(row.prizeText).toBe('50,000 ل.س');
    expect(row.wonOnText).toBe('16/1/2023');
  });

  it('falls back to the email when there is no phone', () => {
    const row = toWinnerRow(buildWinner({ phone: null, email: 'a@mapmob.com' }));
    expect(row.contactText).toBe('a@mapmob.com');
  });

  it('names a voucher by who gives it', () => {
    const row = toWinnerRow(
      buildWinner({
        prize: {
          kind: 'voucher',
          value: { amount: 0, currency: 'SYP' },
          sponsorName: 'مطعم النور',
        },
      }),
    );
    expect(row.prizeText).toBe('قسيمة شرائية مقدمة من مطعم النور');
  });

  it('paints a delivered prize green and a waiting one amber', () => {
    expect(toWinnerRow(buildWinner()).pillClass).toBe('bg-status-success');
    const pending = toWinnerRow(buildWinner({ deliveryStatus: 'pending' }));
    expect(pending.pillClass).toBe('bg-accent');
    expect(pending.statusLabel).toBe('بانتظار التسليم');
  });
});
