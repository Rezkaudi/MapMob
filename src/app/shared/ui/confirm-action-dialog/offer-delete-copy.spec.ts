import { buildOfferDeleteCopy } from './offer-delete-copy';

describe('buildOfferDeleteCopy', () => {
  it('names the offer and warns that the delete is final', () => {
    expect(buildOfferDeleteCopy('خصم 30% على جميع الأزياء الشتوية')).toEqual({
      title: 'حذف العرض',
      question: 'هل أنت متأكد من حذف عرض "خصم 30% على جميع الأزياء الشتوية"؟',
      detail: 'سيتم حذف العرض نهائياً ولن يظهر للمستخدمين، ولا يمكن التراجع عن ذلك.',
      confirmLabel: 'حذف العرض',
      tone: 'danger',
    });
  });
});
