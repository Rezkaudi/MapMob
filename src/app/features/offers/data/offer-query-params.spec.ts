import { toOfferFilterParams, toOfferQueryParams } from './offer-query-params';

const TODAY = '2026-10-13';
const PAGE = { pageIndex: 0, pageSize: 4 };

function entriesOf(params: { keys(): string[]; get(key: string): string | null }) {
  return Object.fromEntries(params.keys().map((key) => [key, params.get(key)]));
}

describe('toOfferQueryParams', () => {
  it('sends the page from 1, the search, the sort and the running days', () => {
    const params = toOfferQueryParams(
      {
        pageIndex: 2,
        pageSize: 4,
        search: 'خصم',
        sort: 'oldest',
        runningFrom: '2026-08-01',
        runningTo: '2026-09-02',
      },
      TODAY,
    );

    expect(entriesOf(params)).toEqual({
      search: 'خصم',
      sort_by: 'oldest',
      ends_from: '2026-08-01',
      starts_to: '2026-09-02',
      page: '3',
      per_page: '4',
    });
  });

  it('leaves out filters that are not set, and the default sort', () => {
    expect(toOfferQueryParams({ ...PAGE, sort: 'newest' }, TODAY).keys()).toEqual([
      'page',
      'per_page',
    ]);
  });
});

describe('toOfferFilterParams', () => {
  it('keeps the filters and drops the page, for the export', () => {
    expect(toOfferFilterParams({ ...PAGE, pageIndex: 3, search: 'خصم' }, TODAY).keys()).toEqual([
      'search',
    ]);
  });

  it('asks for stopped offers under the status the server keeps', () => {
    expect(entriesOf(toOfferFilterParams({ ...PAGE, status: 'paused' }, TODAY))).toEqual({
      status: 'inactive',
    });
  });

  it('asks for drafts by name, which the server answers with none', () => {
    expect(entriesOf(toOfferFilterParams({ ...PAGE, status: 'draft' }, TODAY))).toEqual({
      status: 'draft',
    });
  });

  it('asks for running offers as active ones whose days hold today', () => {
    expect(entriesOf(toOfferFilterParams({ ...PAGE, status: 'active' }, TODAY))).toEqual({
      status: 'active',
      starts_to: '2026-10-13',
      ends_from: '2026-10-13',
    });
  });

  it('asks for coming offers as active ones that start after today', () => {
    expect(entriesOf(toOfferFilterParams({ ...PAGE, status: 'scheduled' }, TODAY))).toEqual({
      status: 'active',
      starts_from: '2026-10-14',
    });
  });

  it('asks for ended offers as active ones that ended before today', () => {
    expect(entriesOf(toOfferFilterParams({ ...PAGE, status: 'expired' }, TODAY))).toEqual({
      status: 'active',
      ends_to: '2026-10-12',
    });
  });

  it('keeps the tighter day when the status and the running days both set one', () => {
    const params = toOfferFilterParams(
      { ...PAGE, status: 'active', runningFrom: '2026-10-20', runningTo: '2026-10-01' },
      TODAY,
    );

    expect(params.get('ends_from')).toBe('2026-10-20');
    expect(params.get('starts_to')).toBe('2026-10-01');
  });
});
