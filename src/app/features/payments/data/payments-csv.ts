import { CsvRow, buildCsvFile } from '../../../shared/files/csv-file';
import { PAYMENT_METHOD_LABELS } from '../models/payment-method';
import { Payment } from '../models/payment';

const HEADER: CsvRow = [
  'رقم العملية',
  'اسم الشركة/المتجر',
  'المبلغ والعملة',
  'تاريخ الدفع',
  'طريقة الدفع',
  'رقم الايصال',
  'ملاحظات',
];

function toRow(payment: Payment): CsvRow {
  return [
    payment.transactionNumber,
    payment.companyName,
    `${payment.amount} ${payment.currency}`,
    payment.paidAt,
    PAYMENT_METHOD_LABELS[payment.paymentMethod],
    payment.receiptNumber,
    payment.notes,
  ];
}

/** The export file has the same columns as the payments table. */
export function buildPaymentsCsvFile(payments: readonly Payment[]): Blob {
  return buildCsvFile([HEADER, ...payments.map(toRow)]);
}
