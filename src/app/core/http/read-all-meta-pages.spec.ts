import { firstValueFrom, of } from 'rxjs';
import { LiveMetaPage, readAllMetaPages } from './read-all-meta-pages';

function page(
  currentPage: number,
  lastPage: number,
  rows: readonly string[],
): LiveMetaPage<string> {
  return { data: rows, meta: { current_page: currentPage, last_page: lastPage } };
}

describe('readAllMetaPages', () => {
  it('reads every page in turn and joins the rows', async () => {
    const pages = [page(1, 3, ['a', 'b']), page(2, 3, ['c']), page(3, 3, ['d'])];
    const askedPages: number[] = [];

    const rows = await firstValueFrom(
      readAllMetaPages((pageNumber) => {
        askedPages.push(pageNumber);
        return of(pages[pageNumber - 1]);
      }),
    );

    expect(askedPages).toEqual([1, 2, 3]);
    expect(rows).toEqual(['a', 'b', 'c', 'd']);
  });

  it('stops after the first page when it is the last', async () => {
    const rows = await firstValueFrom(readAllMetaPages(() => of(page(1, 1, []))));

    expect(rows).toEqual([]);
  });
});
