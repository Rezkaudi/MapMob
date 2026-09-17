import { suggestSendMoment } from './suggest-send-moment';

describe('suggestSendMoment', () => {
  it('suggests the same hour tomorrow, on the hour', () => {
    expect(suggestSendMoment(new Date(2026, 8, 30, 20, 42))).toEqual({
      day: '2026-10-01',
      time: '20:00',
    });
  });
});
