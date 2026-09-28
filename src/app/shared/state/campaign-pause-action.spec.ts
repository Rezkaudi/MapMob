import { campaignPauseActionFor } from './campaign-pause-action';

describe('campaignPauseActionFor', () => {
  it('offers a pause while the campaign still runs, a resume once it is paused, and nothing else', () => {
    expect(campaignPauseActionFor('active')).toBe('pause');
    expect(campaignPauseActionFor('scheduled')).toBe('pause');
    expect(campaignPauseActionFor('paused')).toBe('resume');
    expect(campaignPauseActionFor('expired')).toBeNull();
    expect(campaignPauseActionFor('draft')).toBeNull();
  });
});
