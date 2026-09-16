import { PaymentDetail } from '../app/features/payments/models/payment-detail';
import { MOCK_PLACES } from './mock-places';

function placeCompany(placeId: string) {
  const place = MOCK_PLACES.find((candidate) => candidate.id === placeId);
  if (!place) {
    throw new Error(`لم يتم العثور على المتجر ${placeId}`);
  }
  return { name: place.name, type: place.categoryName };
}

/** Ids follow the payments mock so a detail lookup and a table row always agree. */
export const MOCK_PAYMENTS: readonly PaymentDetail[] = [
  {
    id: 'payment-10254',
    transactionNumber: '#PAY-10254',
    receiptNumber: 'INV-10254',
    companyName: 'صيدلية الحياة',
    amount: 25,
    currency: 'USD',
    paymentMethod: 'cash',
    paidAt: '2026-09-07',
    notes: 'تم تسجيل الدفعة يدوياً بعد استلام التحويل البنكي لحساب المنصة.',
    company: {
      ...placeCompany('place-3'),
      contactName: 'أحمد محمد',
      contactPhone: '+963 944 123 456',
    },
    subscription: {
      planName: 'الباقة الأساسية',
      cycle: 'شهري',
      startsOn: '2026-09-01',
      endsOn: '2026-10-01',
    },
  },
  {
    id: 'payment-1024',
    transactionNumber: '#pay-1024',
    receiptNumber: 'INV-1024',
    companyName: 'صيدلية الحياة',
    amount: 25,
    currency: 'USD',
    paymentMethod: 'cash',
    paidAt: '2024-01-12',
    notes: 'اشتراك مميز باقة سنوية',
    company: {
      ...placeCompany('place-3'),
      contactName: 'أحمد محمد',
      contactPhone: '+963 944 123 456',
    },
    subscription: {
      planName: 'الباقة المميزة',
      cycle: 'سنوي',
      startsOn: '2024-01-12',
      endsOn: '2025-01-12',
    },
  },
  {
    id: 'payment-1031',
    transactionNumber: '#pay-1031',
    receiptNumber: 'INV-1031',
    companyName: 'ألبسة الفاخر',
    amount: 40,
    currency: 'USD',
    paymentMethod: 'other',
    paidAt: '2026-08-20',
    notes: 'تجديد الباقة الأساسية',
    company: {
      ...placeCompany('place-1'),
      contactName: 'سامر خليل',
      contactPhone: '+963 944 222 333',
    },
    subscription: {
      planName: 'الباقة الأساسية',
      cycle: 'شهري',
      startsOn: '2026-08-20',
      endsOn: '2026-09-20',
    },
  },
  {
    id: 'payment-1032',
    transactionNumber: '#pay-1032',
    receiptNumber: 'INV-1032',
    companyName: 'مطعم الأصالة',
    amount: 150000,
    currency: 'SYP',
    paymentMethod: 'cash',
    paidAt: '2026-08-18',
    notes: 'اشتراك باقة النمو',
    company: {
      ...placeCompany('place-4'),
      contactName: 'رامي ديب',
      contactPhone: '+963 933 111 222',
    },
    subscription: {
      planName: 'باقة النمو',
      cycle: 'شهري',
      startsOn: '2026-08-18',
      endsOn: '2026-09-18',
    },
  },
  {
    id: 'payment-1033',
    transactionNumber: '#pay-1033',
    receiptNumber: 'INV-1033',
    companyName: 'مقهى الزاوية',
    amount: 25,
    currency: 'USD',
    paymentMethod: 'other',
    paidAt: '2026-07-30',
    notes: 'اشتراك الباقة الأساسية',
    company: {
      ...placeCompany('place-5'),
      contactName: 'لينا حداد',
      contactPhone: '+963 955 444 555',
    },
    subscription: {
      planName: 'الباقة الأساسية',
      cycle: 'شهري',
      startsOn: '2026-07-30',
      endsOn: '2026-08-30',
    },
  },
  {
    id: 'payment-1034',
    transactionNumber: '#pay-1034',
    receiptNumber: 'INV-1034',
    companyName: 'نادي القوة',
    amount: 300,
    currency: 'USD',
    paymentMethod: 'cash',
    paidAt: '2026-07-10',
    notes: 'اشتراك سنوي كامل',
    company: {
      ...placeCompany('place-6'),
      contactName: 'وائل عيسى',
      contactPhone: '+963 944 555 666',
    },
    subscription: {
      planName: 'الباقة المميزة',
      cycle: 'سنوي',
      startsOn: '2026-07-10',
      endsOn: '2027-07-10',
    },
  },
  {
    id: 'payment-1035',
    transactionNumber: '#pay-1035',
    receiptNumber: 'INV-1035',
    companyName: 'ألبسة الجمال',
    amount: 75000,
    currency: 'SYP',
    paymentMethod: 'other',
    paidAt: '2026-06-22',
    notes: 'تجديد باقة النمو',
    company: {
      ...placeCompany('place-7'),
      contactName: 'هبة نصر',
      contactPhone: '+963 933 777 888',
    },
    subscription: {
      planName: 'باقة النمو',
      cycle: 'شهري',
      startsOn: '2026-06-22',
      endsOn: '2026-07-22',
    },
  },
];
