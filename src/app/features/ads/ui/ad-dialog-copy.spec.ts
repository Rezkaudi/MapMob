import { buildAd } from '../testing/ad-fixture';
import { buildAdConfirmCopy } from './ad-dialog-copy';

const AD = buildAd();

describe('buildAdConfirmCopy', () => {
  it('asks before stopping an ad, in amber, naming the ad', () => {
    expect(buildAdConfirmCopy('pause', AD)).toEqual({
      title: 'إيقاف الإعلان',
      question: 'هل أنت متأكد من رغبتك في إيقاف هذا الإعلان؟',
      detail: 'تم تحديد إعلان "خصم 30% على جميع الأزياء الشتوية"',
      confirmLabel: 'إيقاف الإعلان',
      tone: 'warning',
      detailAppearance: 'toned',
    });
  });

  it('asks before putting an ad back on air', () => {
    expect(buildAdConfirmCopy('resume', AD)).toMatchObject({
      title: 'تفعيل الإعلان',
      question: 'هل أنت متأكد من رغبتك في تفعيل هذا الإعلان؟',
      confirmLabel: 'تفعيل الإعلان',
      tone: 'success',
      detailAppearance: 'toned',
    });
  });

  it('warns that deleting cannot be undone, in the red callout', () => {
    expect(buildAdConfirmCopy('delete', AD)).toEqual({
      title: 'حذف الإعلان',
      question: 'هل أنت متأكد من رغبتك في حذف هذا الإعلان نهائياً؟',
      detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
      confirmLabel: 'حذف الإعلان',
      tone: 'critical',
      detailAppearance: 'callout',
    });
  });
});
