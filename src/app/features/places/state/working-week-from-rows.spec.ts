import { WEEK_DAYS, createDefaultWeek } from '../models/working-day';
import { toWorkingWeek } from './working-week-from-rows';

describe('toWorkingWeek', () => {
  it('keeps the week in the order the editor draws it', () => {
    expect(toWorkingWeek([]).map((day) => day.day)).toEqual([...WEEK_DAYS]);
  });

  it('falls back to the default week when the place has no saved hours', () => {
    expect(toWorkingWeek([])).toEqual(createDefaultWeek());
  });

  it('spreads a day range over every day it covers', () => {
    const week = toWorkingWeek([
      { days: 'الأحد - الخميس', hours: '09:00 AM - 11:00 PM', isToday: false },
    ]);

    const sunday = week.find((day) => day.day === 'الأحد');
    const thursday = week.find((day) => day.day === 'الخميس');
    expect(sunday).toEqual({ day: 'الأحد', isOpen: true, opensAt: '09:00', closesAt: '23:00' });
    expect(thursday).toEqual({ day: 'الخميس', isOpen: true, opensAt: '09:00', closesAt: '23:00' });
  });

  it('closes a day no row mentions', () => {
    const week = toWorkingWeek([
      { days: 'الأحد - الخميس', hours: '09:00 AM - 11:00 PM', isToday: false },
    ]);

    expect(week.find((day) => day.day === 'الجمعة')?.isOpen).toBe(false);
  });

  it('reads a single day written with the "today" note', () => {
    const week = toWorkingWeek([
      { days: 'السبت (اليوم)', hours: '10:00 AM - 10:00 PM', isToday: true },
    ]);

    expect(week.find((day) => day.day === 'السبت')).toEqual({
      day: 'السبت',
      isOpen: true,
      opensAt: '10:00',
      closesAt: '22:00',
    });
  });

  it('reads hours already written on the 24 hour clock', () => {
    const week = toWorkingWeek([{ days: 'الجمعة', hours: '16:00 - 23:59', isToday: false }]);

    expect(week.find((day) => day.day === 'الجمعة')).toEqual({
      day: 'الجمعة',
      isOpen: true,
      opensAt: '16:00',
      closesAt: '23:59',
    });
  });

  it('keeps a day marked "مغلق" closed', () => {
    const week = toWorkingWeek([{ days: 'الجمعة', hours: 'مغلق', isToday: false }]);

    expect(week.find((day) => day.day === 'الجمعة')?.isOpen).toBe(false);
  });

  it('wraps a range that runs past the end of the week', () => {
    const week = toWorkingWeek([
      { days: 'الخميس - السبت', hours: '08:00 AM - 02:00 PM', isToday: false },
    ]);

    const open = week.filter((day) => day.isOpen).map((day) => day.day);
    expect(open).toEqual(['السبت', 'الخميس', 'الجمعة']);
  });

  it('reads midnight and noon on the 12 hour clock', () => {
    const week = toWorkingWeek([{ days: 'السبت', hours: '12:00 AM - 12:00 PM', isToday: false }]);

    expect(week[0].opensAt).toBe('00:00');
    expect(week[0].closesAt).toBe('12:00');
  });
});
