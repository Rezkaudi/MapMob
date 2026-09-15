import { toReviewQueryParams } from './review-query-params';

describe('toReviewQueryParams', () => {
  it('sends the page and only the filters that are set', () => {
    const params = toReviewQueryParams({
      pageIndex: 3,
      pageSize: 4,
      search: 'سارة',
      sort: 'oldest',
      rating: 'fourStarsAndUp',
      status: 'reported',
      placeName: 'صيدلية الحياة',
      submittedFrom: '2026-08-01',
      submittedTo: '2026-09-02',
    });

    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['pageIndex', '3'],
      ['pageSize', '4'],
      ['search', 'سارة'],
      ['sort', 'oldest'],
      ['rating', 'fourStarsAndUp'],
      ['status', 'reported'],
      ['placeName', 'صيدلية الحياة'],
      ['submittedFrom', '2026-08-01'],
      ['submittedTo', '2026-09-02'],
    ]);
  });

  it('leaves out filters that are not set', () => {
    expect(toReviewQueryParams({ pageIndex: 0, pageSize: 4 }).keys()).toEqual([
      'pageIndex',
      'pageSize',
    ]);
  });
});
