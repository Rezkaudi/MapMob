import { buildOffer } from '../testing/offer-fixture';
import { buildOfferDeleteCopy } from './offer-dialog-copy';

describe('buildOfferDeleteCopy', () => {
  it('names the offer and warns that the delete is final', () => {
    expect(buildOfferDeleteCopy(buildOffer())).toEqual({
      title: 'حذف العرض',
      question: 'هل أنت متأكد من حذف عرض "خصم 30% على جميع الأزياء الشتوية"؟',
      detail: 'سيتم حذف العرض نهائياً ولن يظهر للمستخدمين، ولا يمكن التراجع عن ذلك.',
      confirmLabel: 'حذف العرض',
      tone: 'danger',
    });
  });
});
