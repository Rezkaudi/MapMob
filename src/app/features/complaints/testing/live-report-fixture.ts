import { LiveReport } from '../data/live-report';
import { LiveReportedStore } from '../data/live-reported-store';

export const LIVE_REPORT: LiveReport = {
  id: 11,
  user: { id: 16, name: 'خولة', email: null, phone: '963936066472' },
  store: { id: 18, name: 'صيدلية الأمل' },
  reason: 'الموقع على الخريطة غير دقيق',
  description: 'الدبوس بعيد عن المحل',
  status: 'under_review',
  admin_notes: null,
  resolver: { id: null, name: null },
  resolved_at: null,
  images: [{ id: 1, image: 'https://api.test/storage/reports/a.jpg' }],
  created_at: '2026-10-13T06:52:00.000000Z',
  updated_at: '2026-10-13T06:52:00.000000Z',
};

export const LIVE_REPORTED_STORE: LiveReportedStore = {
  id: '18',
  logoUrl: 'https://api.test/logo.jpg',
  mainCategory: { name: 'صيدلية' },
  rating: 4.5,
  reviewCount: 3,
  location: { address: 'دمشق، المزة' },
};
