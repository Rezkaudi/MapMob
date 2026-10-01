import {
  describeRemainingTime,
  describeStoryDay,
  formatStoryDayTime,
  formatStoryMoment,
  formatStoryPublishedTime,
} from './story-time-text';

const NOW = new Date(2026, 9, 1, 20, 30);
const at = (month: number, day: number, hour: number, minute: number) =>
  new Date(2026, month - 1, day, hour, minute).toISOString();

describe('describeRemainingTime', () => {
  it('counts whole hours left, as the card badge does', () => {
    expect(describeRemainingTime(at(10, 2, 10, 30), NOW)).toBe('متبقي 14 ساعة');
    expect(describeRemainingTime(at(10, 2, 0, 0), NOW)).toBe('متبقي 3 ساعات');
  });

  it('says one and two hours by the noun alone', () => {
    expect(describeRemainingTime(at(10, 1, 22, 45), NOW)).toBe('متبقي ساعتان');
    expect(describeRemainingTime(at(10, 1, 21, 40), NOW)).toBe('متبقي ساعة واحدة');
  });

  it('counts minutes in the last hour', () => {
    expect(describeRemainingTime(at(10, 1, 20, 55), NOW)).toBe('متبقي 25 دقيقة');
    expect(describeRemainingTime(at(10, 1, 20, 31), NOW)).toBe('متبقي دقيقة واحدة');
  });

  it('says the story ends soon when the server still calls it active past its time', () => {
    expect(describeRemainingTime(at(10, 1, 20, 29), NOW)).toBe('تنتهي قريباً');
  });
});

describe('describeStoryDay', () => {
  it('names today and yesterday, and writes any other day with its month', () => {
    expect(describeStoryDay(at(10, 1, 10, 30), NOW)).toBe('اليوم');
    expect(describeStoryDay(at(9, 30, 23, 59), NOW)).toBe('أمس');
    expect(describeStoryDay(at(9, 18, 14, 0), NOW)).toBe('18 سبتمبر');
  });
});

describe('formatStoryPublishedTime', () => {
  it('writes the day and the time on a 12-hour clock, as the active card does', () => {
    expect(formatStoryPublishedTime(at(10, 1, 10, 30), NOW)).toBe('اليوم • 10:30 AM');
    expect(formatStoryPublishedTime(at(9, 30, 22, 15), NOW)).toBe('أمس • 10:15 PM');
  });
});

describe('formatStoryDayTime', () => {
  it('writes the day, the month and the time, as the expired card does', () => {
    expect(formatStoryDayTime(at(10, 18, 14, 0))).toBe('18 أكتوبر • 02:00 PM');
    expect(formatStoryDayTime(at(10, 5, 0, 5))).toBe('5 أكتوبر • 12:05 AM');
  });
});

describe('formatStoryMoment', () => {
  it('writes the slash date and the 24-hour time, as the drawer does', () => {
    expect(formatStoryMoment(at(9, 30, 10, 30))).toBe('30/09/2026 - 10:30');
    expect(formatStoryMoment(at(10, 1, 22, 5))).toBe('01/10/2026 - 22:05');
  });
});
