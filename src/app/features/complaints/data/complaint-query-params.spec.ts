import { toComplaintQueryParams } from './complaint-query-params';

describe('toComplaintQueryParams', () => {
  it('always sends the page, and only the filters that are set', () => {
    const params = toComplaintQueryParams({ pageIndex: 2, pageSize: 4 });

    expect(params.keys()).toEqual(['pageIndex', 'pageSize']);
    expect(params.get('pageIndex')).toBe('2');
  });

  it('sends search, sort, status and the report days', () => {
    const params = toComplaintQueryParams({
      pageIndex: 0,
      pageSize: 4,
      search: '#1023',
      sort: 'newest',
      status: 'inReview',
      reportedFrom: '2026-08-01',
      reportedTo: '2026-09-02',
    });

    expect(params.get('search')).toBe('#1023');
    expect(params.get('sort')).toBe('newest');
    expect(params.get('status')).toBe('inReview');
    expect(params.get('reportedFrom')).toBe('2026-08-01');
    expect(params.get('reportedTo')).toBe('2026-09-02');
  });
});
