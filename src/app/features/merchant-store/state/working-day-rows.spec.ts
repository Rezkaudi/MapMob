import { buildWeek } from '../testing/store-profile-fixture';
import { toWorkingDayRows } from './working-day-rows';

describe('toWorkingDayRows', () => {
  it('names each day in Arabic and writes its hours on a 12-hour clock', () => {
    const [saturday] = toWorkingDayRows(buildWeek());

    expect(saturday).toEqual({
      day: 'saturday',
      label: 'السبت',
      isOpen: true,
      openTime: '09:00',
      closeTime: '23:00',
      openTimeText: '09:00 ص',
      closeTimeText: '11:00 م',
    });
  });

  it('keeps the week in order, Saturday first, Friday last', () => {
    expect(toWorkingDayRows(buildWeek()).map((row) => row.label)).toEqual([
      'السبت',
      'الأحد',
      'الإثنين',
      'الثلاثاء',
      'الأربعاء',
      'الخميس',
      'الجمعة',
    ]);
  });

  it('shows a closed day with no hours', () => {
    const friday = toWorkingDayRows(buildWeek()).at(-1);

    expect(friday).toMatchObject({ isOpen: false, openTimeText: '', closeTimeText: '' });
  });
});
