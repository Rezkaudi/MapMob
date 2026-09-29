import { buildDeliveryPlatform } from '../testing/delivery-platform-fixture';
import {
  buildDeliveryPlatformConfirmCopy,
  DELIVERY_PLATFORM_FORM_COPY,
} from './delivery-platform-dialog-copy';

describe('delivery platform dialog copy', () => {
  it('words the add dialog as the frame does, with the platform noun in the subtitle', () => {
    expect(DELIVERY_PLATFORM_FORM_COPY.create).toEqual({
      heading: 'إضافة منصة طلبات جديدة',
      subheading: 'أضف بيانات منصة الطلبات لتظهر ضمن صفحات المتاجر.',
      submitLabel: 'إضافة منصة',
      submitIcon: 'add',
    });
  });

  it('names the platform in each confirmation', () => {
    const talabat = buildDeliveryPlatform();

    expect(buildDeliveryPlatformConfirmCopy('suspend', talabat)).toMatchObject({
      title: 'تعطيل المنصة',
      question: 'هل أنت متأكد من تعطيل منصة طلبات؟',
      tone: 'danger',
    });
    expect(buildDeliveryPlatformConfirmCopy('activate', talabat)).toMatchObject({
      question: 'هل تريد تفعيل منصة طلبات؟',
      tone: 'success',
    });
    expect(buildDeliveryPlatformConfirmCopy('delete', talabat)).toMatchObject({
      title: 'حذف المنصة',
      confirmLabel: 'حذف المنصة',
    });
  });
});
