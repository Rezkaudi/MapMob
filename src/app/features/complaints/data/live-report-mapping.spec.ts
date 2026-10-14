import { LIVE_REPORT, LIVE_REPORTED_STORE } from '../testing/live-report-fixture';
import {
  toComplaint,
  toComplaintDetail,
  toComplaintStatus,
  toLiveReportStatus,
} from './live-report-mapping';

describe('live report mapping', () => {
  it('reads a report as a table row', () => {
    expect(toComplaint(LIVE_REPORT)).toEqual({
      id: '11',
      reference: '#11',
      reason: 'الموقع على الخريطة غير دقيق',
      status: 'inReview',
      reportedOn: '2026-10-13',
      reporter: { id: '16', name: 'خولة', email: '', phone: '963936066472' },
      place: {
        id: '18',
        name: 'صيدلية الأمل',
        categoryName: '',
        address: '',
        rating: 0,
        reviewCount: 0,
        imageUrl: null,
      },
    });
  });

  it('fills the place card from the store and the text boxes from the report', () => {
    const detail = toComplaintDetail(LIVE_REPORT, LIVE_REPORTED_STORE);

    expect(detail.place).toEqual({
      id: '18',
      name: 'صيدلية الأمل',
      categoryName: 'صيدلية',
      address: 'دمشق، المزة',
      rating: 4.5,
      reviewCount: 3,
      imageUrl: 'https://api.test/logo.jpg',
    });
    expect(detail.description).toBe('الموقع على الخريطة غير دقيق');
    expect(detail.userDetails).toBe('الدبوس بعيد عن المحل');
    expect(detail.attachmentUrls).toEqual(['https://api.test/storage/reports/a.jpg']);
    expect(detail.adminNotes).toBe('');
  });

  it('keeps the place card short when the store is gone', () => {
    expect(toComplaintDetail(LIVE_REPORT, null).place.categoryName).toBe('');
  });

  it('turns the server status words into the panel ones and back', () => {
    expect(toComplaintStatus('new')).toBe('new');
    expect(toComplaintStatus('under_review')).toBe('inReview');
    expect(toComplaintStatus('resolved')).toBe('resolved');
    expect(toComplaintStatus('rejected')).toBe('rejected');
    expect(toComplaintStatus('something')).toBe('new');
    expect(toLiveReportStatus('inReview')).toBe('under_review');
    expect(toLiveReportStatus('rejected')).toBe('rejected');
  });
});
