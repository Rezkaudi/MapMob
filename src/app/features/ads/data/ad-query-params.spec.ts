import { toAdFilterParams } from './ad-query-params';

const TODAY = '2026-11-08';
const PAGE = { pageIndex: 1, pageSize: 4 };

function entriesOf(params: ReturnType<typeof toAdFilterParams>): string[][] {
  return params.keys().map((key) => [key, params.get(key) ?? '']);
}

describe('toAdFilterParams', () => {
  it('sends every picked filter with the Postman names', () => {
    const params = toAdFilterParams(
      {
        ...PAGE,
        search: 'حملة',
        sort: 'newest',
        status: 'paused',
        contentType: 'video',
        advertiserType: 'place',
        placement: 'searchResults',
        runningFrom: '2026-11-01',
        runningTo: '2026-11-30',
      },
      TODAY,
    );

    expect(entriesOf(params)).toEqual([
      ['search', 'حملة'],
      ['sort_by', 'latest'],
      ['status', 'inactive'],
      ['media_type', 'video'],
      ['advertiser_type', 'company'],
      ['placement', 'search'],
      ['date_from', '2026-11-01'],
      ['date_to', '2026-11-30'],
    ]);
  });

  it('sends running and ended ads by their server status', () => {
    expect(toAdFilterParams({ ...PAGE, status: 'active' }, TODAY).get('status')).toBe('active');
    expect(toAdFilterParams({ ...PAGE, status: 'expired' }, TODAY).get('status')).toBe('expired');
  });

  it('asks for ads starting from tomorrow when the panel wants coming ones', () => {
    expect(entriesOf(toAdFilterParams({ ...PAGE, status: 'scheduled' }, TODAY))).toEqual([
      ['date_from', '2026-11-09'],
    ]);
  });

  it('names an ad by the admin team "admin"', () => {
    expect(
      toAdFilterParams({ ...PAGE, advertiserType: 'admin' }, TODAY).get('advertiser_type'),
    ).toBe('admin');
  });

  it('starts coming ads from tomorrow, or from a later first day the filter picked', () => {
    expect(
      toAdFilterParams({ ...PAGE, status: 'scheduled', runningFrom: '2026-11-01' }, TODAY).get(
        'date_from',
      ),
    ).toBe('2026-11-09');
    expect(
      toAdFilterParams({ ...PAGE, status: 'scheduled', runningFrom: '2026-12-01' }, TODAY).get(
        'date_from',
      ),
    ).toBe('2026-12-01');
  });

  it('sends nothing when no filter is picked', () => {
    expect(toAdFilterParams(PAGE, TODAY).keys()).toEqual([]);
  });
});
