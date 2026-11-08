import { toReviewFilterParams } from './review-query-params';

const PAGE = { pageIndex: 3, pageSize: 10 };

function entriesOf(query: Parameters<typeof toReviewFilterParams>[0]): string[][] {
  const params = toReviewFilterParams(query);
  return params.keys().map((key) => [key, params.get(key) ?? '']);
}

describe('toReviewFilterParams', () => {
  it('sends the search, the sort, the place and the days of submission', () => {
    expect(
      entriesOf({
        ...PAGE,
        search: 'ممتاز',
        sort: 'newest',
        placeName: 'Demo',
        submittedFrom: '2026-11-01',
        submittedTo: '2026-11-08',
      }),
    ).toEqual([
      ['search', 'ممتاز'],
      ['sort_by', 'latest'],
      ['store_name', 'Demo'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-08'],
    ]);
  });

  it('sends an exact star count as rating', () => {
    expect(toReviewFilterParams({ ...PAGE, rating: 'fiveStars' }).get('rating')).toBe('5');
    expect(toReviewFilterParams({ ...PAGE, rating: 'fourStars' }).get('rating')).toBe('4');
    expect(toReviewFilterParams({ ...PAGE, rating: 'threeStars' }).get('rating')).toBe('3');
    expect(toReviewFilterParams({ ...PAGE, rating: 'twoStars' }).get('rating')).toBe('2');
    expect(toReviewFilterParams({ ...PAGE, rating: 'oneStar' }).get('rating')).toBe('1');
  });

  it('sends "no stars" as is_rated=0', () => {
    expect(entriesOf({ ...PAGE, rating: 'unrated' })).toEqual([['is_rated', '0']]);
  });

  it('sends hidden as the server status, and published or reported as is_reported', () => {
    expect(entriesOf({ ...PAGE, status: 'hidden' })).toEqual([['status', 'hidden']]);
    expect(entriesOf({ ...PAGE, status: 'reported' })).toEqual([['is_reported', '1']]);
    expect(entriesOf({ ...PAGE, status: 'published' })).toEqual([['is_reported', '0']]);
  });

  it('sends nothing when no filter is picked', () => {
    expect(toReviewFilterParams(PAGE).keys()).toEqual([]);
  });
});
