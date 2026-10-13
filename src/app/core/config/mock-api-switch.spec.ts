import { isMockApiUsed } from './mock-api-switch';

describe('isMockApiUsed', () => {
  it('uses the mock for every feature while the mock flag is on', () => {
    expect(isMockApiUsed('dashboard', { isMockFlagOn: true, liveFeatures: ['dashboard'] })).toBe(
      true,
    );
  });

  it('uses the live API for a feature on the live list once the flag is off', () => {
    expect(isMockApiUsed('dashboard', { isMockFlagOn: false, liveFeatures: ['dashboard'] })).toBe(
      false,
    );
  });

  it('keeps the mock for a feature the live server cannot serve yet', () => {
    expect(isMockApiUsed('payments', { isMockFlagOn: false, liveFeatures: ['dashboard'] })).toBe(
      true,
    );
  });
});
