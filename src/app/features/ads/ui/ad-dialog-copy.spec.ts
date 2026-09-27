import { buildAd } from '../testing/ad-fixture';
import { buildAdConfirmCopy } from './ad-dialog-copy';

const AD = buildAd();

describe('buildAdConfirmCopy', () => {
  it('asks before stopping an ad', () => {
    expect(buildAdConfirmCopy('pause', AD)).toMatchObject({
      title: 'إيقاف الإعلان',
      confirmLabel: 'إيقاف الإعلان',
      tone: 'danger',
    });
  });

  it('asks before putting an ad back on air', () => {
    expect(buildAdConfirmCopy('resume', AD)).toMatchObject({
      title: 'تفعيل الإعلان',
      confirmLabel: 'تفعيل الإعلان',
      tone: 'success',
    });
  });

  it('names the ad in the delete question', () => {
    expect(buildAdConfirmCopy('delete', AD).question).toContain('خصم 30%');
  });
});
