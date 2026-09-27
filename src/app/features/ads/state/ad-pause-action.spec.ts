import { adPauseActionFor } from './ad-pause-action';

describe('adPauseActionFor', () => {
  it('offers a pause while the ad still runs, a resume once it is paused, and nothing else', () => {
    expect(adPauseActionFor('active')).toBe('pause');
    expect(adPauseActionFor('scheduled')).toBe('pause');
    expect(adPauseActionFor('paused')).toBe('resume');
    expect(adPauseActionFor('expired')).toBeNull();
    expect(adPauseActionFor('draft')).toBeNull();
  });
});
