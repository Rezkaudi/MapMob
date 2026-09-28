import { buildWeek } from '../testing/store-profile-fixture';
import { closeDay, openDay, setDayTime, toSavedWeek } from './working-week-editing';

describe('working week editing', () => {
  it('closes one day and leaves the others alone', () => {
    const week = closeDay(buildWeek(), 'sunday');

    expect(week.find((day) => day.day === 'sunday')?.isOpen).toBe(false);
    expect(week.filter((day) => day.isOpen)).toHaveLength(5);
  });

  it('keeps the hours of a closed day, so opening it again brings them back', () => {
    const week = openDay(closeDay(buildWeek(), 'sunday'), 'sunday');

    expect(week.find((day) => day.day === 'sunday')).toEqual({
      day: 'sunday',
      isOpen: true,
      openTime: '09:00',
      closeTime: '23:00',
    });
  });

  it('opens a day that never had hours from 09:00 to 23:00', () => {
    const week = openDay(buildWeek(), 'friday');

    expect(week.find((day) => day.day === 'friday')).toEqual({
      day: 'friday',
      isOpen: true,
      openTime: '09:00',
      closeTime: '23:00',
    });
  });

  it('changes the opening or the closing time of one day', () => {
    const opened = setDayTime(buildWeek(), 'monday', 'openTime', '08:30');
    const closed = setDayTime(opened, 'monday', 'closeTime', '21:00');

    expect(closed.find((day) => day.day === 'monday')).toMatchObject({
      openTime: '08:30',
      closeTime: '21:00',
    });
    expect(closed.find((day) => day.day === 'sunday')?.openTime).toBe('09:00');
  });

  it('sends no hours for a closed day', () => {
    const saved = toSavedWeek(closeDay(buildWeek(), 'sunday'));

    expect(saved.find((day) => day.day === 'sunday')).toEqual({
      day: 'sunday',
      isOpen: false,
      openTime: null,
      closeTime: null,
    });
    expect(saved.find((day) => day.day === 'monday')?.openTime).toBe('09:00');
  });
});
