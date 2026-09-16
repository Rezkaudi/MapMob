import { buildPaymentDetail } from '../testing/payment-fixture';
import { buildPaymentsCsvFile } from './payments-csv';

describe('buildPaymentsCsvFile', () => {
  it('writes one row per payment with the table columns', async () => {
    const payment = buildPaymentDetail({
      transactionNumber: '#pay-1024',
      companyName: 'صيدلية الحياة',
      amount: 25,
      currency: 'USD',
      paymentMethod: 'cash',
      paidAt: '2024-01-12',
      receiptNumber: 'INV-1024',
      notes: 'اشتراك مميز باقة سنوية',
    });

    const text = await buildPaymentsCsvFile([payment]).text();

    expect(text).toContain('رقم العملية,اسم الشركة/المتجر,المبلغ والعملة');
    expect(text).toContain('#pay-1024,صيدلية الحياة,25 USD,2024-01-12,نقداً,INV-1024');
    expect(text).toContain('اشتراك مميز باقة سنوية');
  });
});
