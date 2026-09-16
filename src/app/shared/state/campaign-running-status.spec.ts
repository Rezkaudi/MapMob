import { resolveRunningStatus } from './campaign-running-status';

describe('resolveRunningStatus', () => {
  const offerDays = { startsOn: '2026-09-01', endsOn: '2026-09-15' };

  it('is scheduled before the first day', () => {
    expect(resolveRunningStatus(offerDays, '2026-08-31')).toBe('scheduled');
  });

  it('is active from the first day to the last day, both included', () => {
    expect(resolveRunningStatus(offerDays, '2026-09-01')).toBe('active');
    expect(resolveRunningStatus(offerDays, '2026-09-15')).toBe('active');
  });

  it('is expired after the last day', () => {
    expect(resolveRunningStatus(offerDays, '2026-09-16')).toBe('expired');
  });

  it('never expires a campaign without a last day', () => {
    expect(resolveRunningStatus({ startsOn: '2026-09-01', endsOn: null }, '2030-01-01')).toBe(
      'active',
    );
  });
});
