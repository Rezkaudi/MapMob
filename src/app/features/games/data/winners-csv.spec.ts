import { buildWinner } from '../testing/game-fixture';
import { buildWinnersCsvRows } from './winners-csv';

describe('buildWinnersCsvRows', () => {
  it('writes a header, then one line per winner', () => {
    const rows = buildWinnersCsvRows([buildWinner({ deliveryStatus: 'pending' })]);
    expect(rows[0]).toEqual([
      'الفائز',
      'رقم الهاتف',
      'البريد الإلكتروني',
      'اللعبة',
      'الجائزة',
      'تاريخ الفوز',
      'حالة الجائزة',
    ]);
    expect(rows[1]).toEqual([
      'أحمد جمال',
      '093608934',
      '',
      'الأكثرية والأقلية — الجولة #104',
      'جائزة مالية بقيمة 50,000 ل.س',
      '2023-01-16',
      'بانتظار التسليم',
    ]);
  });
});
