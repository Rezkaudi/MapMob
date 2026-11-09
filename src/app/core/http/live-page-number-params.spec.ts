import { HttpParams } from '@angular/common/http';
import { withPageNumber } from './live-page-number-params';

describe('withPageNumber', () => {
  it('asks the server for the table page, counted from one', () => {
    const params = withPageNumber(new HttpParams().set('search', 'خصم'), {
      pageIndex: 2,
      pageSize: 4,
    });

    expect(params.get('search')).toBe('خصم');
    expect(params.get('page')).toBe('3');
    expect(params.get('per_page')).toBe('4');
  });
});
