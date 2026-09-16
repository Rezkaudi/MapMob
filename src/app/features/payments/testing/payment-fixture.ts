import { PaymentDetail } from '../models/payment-detail';

export function buildPaymentDetail(overrides: Partial<PaymentDetail> = {}): PaymentDetail {
  return {
    id: 'payment-1',
    transactionNumber: '#pay-1024',
    receiptNumber: 'INV-1024',
    companyName: 'صيدلية الحياة',
    amount: 25,
    currency: 'USD',
    paymentMethod: 'cash',
    paidAt: '2024-01-12',
    notes: 'اشتراك مميز باقة سنوية',
    company: {
      name: 'صيدلية الحياة',
      type: 'صيدلية',
      contactName: 'أحمد محمد',
      contactPhone: '+963 944 123 456',
    },
    subscription: {
      planName: 'الباقة الأساسية',
      cycle: 'شهري',
      startsOn: '2026-09-01',
      endsOn: '2026-10-01',
    },
    ...overrides,
  };
}
