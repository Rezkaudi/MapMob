import { toAdFilterParams } from './ad-query-params';

const PAGE = { pageIndex: 1, pageSize: 4 };

function entriesOf(params: ReturnType<typeof toAdFilterParams>): string[][] {
  return params.keys().map((key) => [key, params.get(key) ?? '']);
}

describe('toAdFilterParams', () => {
  it('sends every picked filter with the Postman names', () => {
    const params = toAdFilterParams({
      ...PAGE,
      search: 'حملة',
      sort: 'newest',
      status: 'paused',
      contentType: 'video',
      advertiserType: 'place',
      placement: 'searchResults',
      runningFrom: '2026-11-01',
      runningTo: '2026-11-30',
    });

    expect(entriesOf(params)).toEqual([
      ['search', 'حملة'],
      ['sort_by', 'latest'],
      ['status', 'inactive'],
      ['media_type', 'video'],
      ['advertiser_type', 'store'],
      ['placement', 'search'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-30'],
    ]);
  });

  it('asks for store ads by the word the server saves them with', () => {
    expect(toAdFilterParams({ ...PAGE, advertiserType: 'place' }).get('advertiser_type')).toBe(
      'store',
    );
  });

  it('sends running and ended ads by their server status', () => {
    expect(toAdFilterParams({ ...PAGE, status: 'active' }).get('status')).toBe('active');
    expect(toAdFilterParams({ ...PAGE, status: 'expired' }).get('status')).toBe('expired');
  });

  it('asks the server for coming ads by their status', () => {
    expect(entriesOf(toAdFilterParams({ ...PAGE, status: 'scheduled' }))).toEqual([
      ['status', 'scheduled'],
    ]);
  });

  it('names an ad by the admin team "admin"', () => {
    expect(toAdFilterParams({ ...PAGE, advertiserType: 'admin' }).get('advertiser_type')).toBe(
      'admin',
    );
  });

  it('keeps the picked days as they are for coming ads', () => {
    const params = toAdFilterParams({ ...PAGE, status: 'scheduled', runningFrom: '2026-11-01' });
    expect(params.get('date_from')).toBe('2026-11-01');
  });

  it('sends nothing when no filter is picked', () => {
    expect(toAdFilterParams(PAGE).keys()).toEqual([]);
  });
});
