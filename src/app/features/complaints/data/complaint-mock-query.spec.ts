import { buildComplaintDetail } from '../testing/complaint-fixture';
import { filterComplaints, queryComplaints } from './complaint-mock-query';

const SHAM = buildComplaintDetail();
const OLD_REJECTED = buildComplaintDetail({
  id: 'complaint-2',
  reference: '#1024',
  status: 'rejected',
  reportedOn: '2026-08-01',
  place: { ...SHAM.place, name: 'مقهى الزاوية' },
});
const LATEST_RESOLVED = buildComplaintDetail({
  id: 'complaint-3',
  reference: '#1025',
  status: 'resolved',
  reportedOn: '2026-09-12',
  reporter: { ...SHAM.reporter, name: 'خالد يوسف' },
});
const ALL = [SHAM, OLD_REJECTED, LATEST_RESOLVED];

describe('filterComplaints', () => {
  it('searches by reference or place name, as the search box promises', () => {
    expect(filterComplaints(ALL, { pageIndex: 0, pageSize: 4, search: '1024' })).toEqual([
      OLD_REJECTED,
    ]);
    expect(filterComplaints(ALL, { pageIndex: 0, pageSize: 4, search: 'الزاوية' })).toEqual([
      OLD_REJECTED,
    ]);
  });

  it('keeps one status', () => {
    expect(filterComplaints(ALL, { pageIndex: 0, pageSize: 4, status: 'resolved' })).toEqual([
      LATEST_RESOLVED,
    ]);
  });

  it('keeps the complaints reported inside the day range, both ends included', () => {
    const matching = filterComplaints(ALL, {
      pageIndex: 0,
      pageSize: 4,
      reportedFrom: '2026-08-01',
      reportedTo: '2026-09-09',
    });

    expect(matching).toEqual([SHAM, OLD_REJECTED]);
  });

  it('puts the newest report first when asked', () => {
    const sorted = filterComplaints(ALL, { pageIndex: 0, pageSize: 4, sort: 'newest' });

    expect(sorted.map((complaint) => complaint.id)).toEqual([
      'complaint-3',
      'complaint-1',
      'complaint-2',
    ]);
  });
});

describe('queryComplaints', () => {
  it('returns one page and the full count', () => {
    const page = queryComplaints(ALL, { pageIndex: 1, pageSize: 2 });

    expect(page.items).toEqual([LATEST_RESOLVED]);
    expect(page.totalCount).toBe(3);
  });
});
