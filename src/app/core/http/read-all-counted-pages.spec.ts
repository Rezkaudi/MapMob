import { firstValueFrom, of } from 'rxjs';
import { readAllCountedPages } from './read-all-counted-pages';

describe('readAllCountedPages', () => {
  it('reads one page when the total fits in it', async () => {
    const pages: number[] = [];
    const rows = await firstValueFrom(
      readAllCountedPages((page) => {
        pages.push(page);
        return of({ items: ['a', 'b'], totalCount: 2 });
      }, 100),
    );

    expect(rows).toEqual(['a', 'b']);
    expect(pages).toEqual([1]);
  });

  it('works out the pages from the total and reads each in turn', async () => {
    const pages: number[] = [];
    const rows = await firstValueFrom(
      readAllCountedPages((page) => {
        pages.push(page);
        return of({ items: [`row ${page}`], totalCount: 3 });
      }, 1),
    );

    expect(pages).toEqual([1, 2, 3]);
    expect(rows).toEqual(['row 1', 'row 2', 'row 3']);
  });
});
