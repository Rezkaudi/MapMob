import { canServerExport, toServerExportParams } from './subscription-export-filters';

const PAGE = { pageIndex: 0, pageSize: 10 };

describe('subscription export filters', () => {
  it('lets the server export with no filter or a status it knows', () => {
    expect(canServerExport(PAGE)).toBe(true);
    expect(canServerExport({ ...PAGE, status: 'active' })).toBe(true);
    expect(canServerExport({ ...PAGE, status: 'expired', sort: 'oldest' })).toBe(true);
  });

  it('keeps the export here for filters the server ignores', () => {
    expect(canServerExport({ ...PAGE, status: 'paused' })).toBe(false);
    expect(canServerExport({ ...PAGE, search: 'دمشق' })).toBe(false);
    expect(canServerExport({ ...PAGE, tier: 'basic' })).toBe(false);
    expect(canServerExport({ ...PAGE, subscribedFrom: '2026-10-01' })).toBe(false);
  });

  it('sends only the status', () => {
    expect(toServerExportParams({ ...PAGE, status: 'expired' })).toEqual({ status: 'expired' });
    expect(toServerExportParams(PAGE)).toEqual({});
  });
});
