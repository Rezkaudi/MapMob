import { buildPaymentDetail } from '../testing/payment-fixture';
import { buildPaymentDeleteCopy } from './payment-delete-copy';

describe('buildPaymentDeleteCopy', () => {
  it('names the payment and its place, and warns it cannot be undone', () => {
    const copy = buildPaymentDeleteCopy(buildPaymentDetail());

    expect(copy.title).toBe('حذف الدفعة');
    expect(copy.question).toContain('#pay-1024');
    expect(copy.question).toContain('صيدلية الحياة');
    expect(copy.detail).toContain('لا يمكن التراجع');
    expect(copy.confirmLabel).toBe('حذف الدفعة');
    expect(copy.tone).toBe('danger');
  });

  it('keeps the Latin payment number in its own direction inside the Arabic line', () => {
    const copy = buildPaymentDeleteCopy(buildPaymentDetail());

    expect(copy.question).toContain('⁦#pay-1024⁩');
  });
});
