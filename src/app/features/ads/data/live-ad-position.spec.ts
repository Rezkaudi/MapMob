import { AdPosition } from '../models/ad-position';
import { toAdPosition, toLiveAdPosition } from './live-ad-position';

describe('live ad position', () => {
  it.each<[AdPosition, string]>([
    ['topBanner', 'top'],
    ['middleBanner', 'middle'],
    ['bottomBanner', 'bottom'],
  ])('maps %s to the server word %s and back', (position, livePosition) => {
    expect(toLiveAdPosition(position)).toBe(livePosition);
    expect(toAdPosition(livePosition)).toBe(position);
  });

  it.each([undefined, null, 'unknown'])('reads %s as the top banner', (livePosition) => {
    expect(toAdPosition(livePosition)).toBe('topBanner');
  });
});
