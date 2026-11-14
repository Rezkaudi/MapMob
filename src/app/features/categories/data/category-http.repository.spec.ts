import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CategoryDraft } from '../models/category-draft';
import { LIVE_MAIN_CATEGORY, LIVE_SUB_CATEGORY } from '../testing/live-category-fixture';
import { CATEGORY_HAS_CHILDREN_MESSAGE, CategoryHttpRepository } from './category-http.repository';
import { CategoryIconFileMaker } from './category-icon-file-maker';

const BASE_URL = 'https://api.test';
const CATEGORIES_URL = `${BASE_URL}/admin/categories`;
const ICON_FILE = new File(['x'], 'store.png', { type: 'image/png' });
const DRAFT: CategoryDraft = {
  name: 'مخابز',
  kind: 'sub',
  parentId: '1',
  icon: 'store',
  color: '#0583EC',
};

describe('CategoryHttpRepository', () => {
  let repository: CategoryHttpRepository;
  let http: HttpTestingController;
  const madeIcons: string[] = [];

  function answerMainCategories(): void {
    http
      .expectOne((request) => request.url === CATEGORIES_URL && request.method === 'GET')
      .flush({ data: [LIVE_MAIN_CATEGORY], meta: { total: 1 } });
  }

  function isCountCall(request: { params: { get(name: string): string | null } }): boolean {
    return request.params.get('per_page') === '1';
  }

  async function settle(): Promise<void> {
    await new Promise((resolve) => setTimeout(resolve));
  }

  beforeEach(() => {
    madeIcons.length = 0;
    TestBed.configureTestingModule({
      providers: [
        CategoryHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        {
          provide: CategoryIconFileMaker,
          useValue: {
            makeFile: async (icon: string) => {
              madeIcons.push(icon);
              return ICON_FILE;
            },
          },
        },
      ],
    });
    repository = TestBed.inject(CategoryHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks the server for one filtered page, the tab counts and the Arabic parent names', async () => {
    const response = firstValueFrom(
      repository.getCategories({
        pageIndex: 1,
        pageSize: 5,
        kind: 'sub',
        search: 'وجبات',
        status: 'suspended',
        sort: 'newest',
      }),
    );

    const calls = http.match((call) => call.url === CATEGORIES_URL);
    const rows = calls.find((call) => call.request.params.get('page') === '2');
    const counts = calls.filter((call) => isCountCall(call.request));
    const allCount = counts.find((call) => !call.request.params.has('parent_id'));
    const mainCount = counts.find((call) => call.request.params.has('parent_id'));
    const mains = calls.find(
      (call) => call !== rows && !isCountCall(call.request) && call.request.params.has('parent_id'),
    );

    const rowParams = rows!.request.params;
    expect(rowParams.keys().map((key) => [key, rowParams.get(key)])).toEqual([
      ['search', 'وجبات'],
      ['sort_by', 'latest'],
      ['is_active', '0'],
      ['has_parent', '1'],
      ['page', '2'],
      ['per_page', '5'],
    ]);
    expect(allCount!.request.params.has('has_parent')).toBe(false);
    expect(allCount!.request.params.get('search')).toBe('وجبات');
    expect(mainCount!.request.params.get('parent_id')).toBe('');
    rows!.flush({ data: [LIVE_SUB_CATEGORY], meta: { total: 6 } });
    allCount!.flush({ data: [LIVE_MAIN_CATEGORY], meta: { total: 9 } });
    mainCount!.flush({ data: [LIVE_MAIN_CATEGORY], meta: { total: 3 } });
    mains!.flush({ data: [LIVE_MAIN_CATEGORY], meta: { total: 1 } });

    const page = await response;
    expect(page.totalCount).toBe(6);
    expect(page.items.map((category) => category.id)).toEqual(['17']);
    expect(page.items[0].parentName).toBe('مطاعم');
    expect(page.kindCounts).toEqual({ all: 9, main: 3, sub: 6 });
  });

  it('shows the rows the server sends, even of another kind', async () => {
    const response = firstValueFrom(
      repository.getCategories({ pageIndex: 0, pageSize: 5, kind: 'sub' }),
    );

    const calls = http.match((call) => call.url === CATEGORIES_URL);
    for (const call of calls) {
      call.flush({ data: [LIVE_MAIN_CATEGORY, LIVE_SUB_CATEGORY], meta: { total: 2 } });
    }

    expect((await response).items.map((category) => category.id)).toEqual(['1', '17']);
  });

  it('reads every page of main categories, 100 at a time, with an empty parent id', async () => {
    const response = firstValueFrom(repository.getMainCategories());
    const first = http.expectOne((call) => call.url === CATEGORIES_URL);
    expect(first.request.params.get('parent_id')).toBe('');
    expect(first.request.urlWithParams).toContain('parent_id=&');
    expect(first.request.params.get('per_page')).toBe('100');
    first.flush({ data: [LIVE_MAIN_CATEGORY], meta: { current_page: 1, last_page: 2, total: 2 } });
    const second = http.expectOne((call) => call.url === CATEGORIES_URL);
    expect(second.request.params.get('page')).toBe('2');
    second.flush({
      data: [{ ...LIVE_MAIN_CATEGORY, id: 2, name: 'صيدليات' }],
      meta: { current_page: 2, last_page: 2, total: 2 },
    });

    expect((await response).map((category) => category.id)).toEqual(['1', '2']);
  });

  it('creates a category with the picked icon drawn as a file', async () => {
    const response = firstValueFrom(repository.createCategory(DRAFT));
    await settle();

    const request = http.expectOne({ method: 'POST', url: CATEGORIES_URL });
    const body = request.request.body as FormData;
    expect(body.get('icon')).toBe(ICON_FILE);
    expect(body.get('parent_id')).toBe('1');
    request.flush({ data: LIVE_SUB_CATEGORY });
    answerMainCategories();

    expect((await response).id).toBe('17');
    expect(madeIcons).toEqual(['store']);
  });

  it('updates with PUT inside a POST and keeps the old icon when none was picked', async () => {
    const response = firstValueFrom(repository.updateCategory('17', { ...DRAFT, icon: '' }));
    await settle();

    const request = http.expectOne({ method: 'POST', url: `${CATEGORIES_URL}/17` });
    const body = request.request.body as FormData;
    expect(body.get('_method')).toBe('PUT');
    expect(body.has('icon')).toBe(false);
    request.flush({ data: LIVE_SUB_CATEGORY });
    answerMainCategories();

    expect((await response).parentName).toBe('مطاعم');
    expect(madeIcons).toEqual([]);
  });

  it('switches a category on or off with a PUT', async () => {
    const response = firstValueFrom(repository.setCategoryStatus('17', 'active'));

    const request = http.expectOne({ method: 'PUT', url: `${CATEGORIES_URL}/17` });
    expect(request.request.body).toEqual({ is_active: true });
    request.flush({ data: { ...LIVE_SUB_CATEGORY, is_active: true } });
    answerMainCategories();

    expect((await response).status).toBe('active');
  });

  it('deletes one category', async () => {
    const response = firstValueFrom(repository.deleteCategory('17'));

    http.expectOne({ method: 'DELETE', url: `${CATEGORIES_URL}/17` }).flush({});

    expect(await response).toBeUndefined();
  });

  it('says in Arabic why the server refuses to delete a category with sub categories', async () => {
    const response = firstValueFrom(repository.deleteCategory('4'));

    http
      .expectOne({ method: 'DELETE', url: `${CATEGORIES_URL}/4` })
      .flush(
        { message: 'Cannot delete this category because it has child categories.' },
        { status: 422, statusText: 'Unprocessable Content' },
      );

    await expect(response).rejects.toThrow(CATEGORY_HAS_CHILDREN_MESSAGE);
    expect(CATEGORY_HAS_CHILDREN_MESSAGE).toContain('تصنيفات فرعية');
  });

  it('keeps any other delete error as it is', async () => {
    const response = firstValueFrom(repository.deleteCategory('4'));

    http
      .expectOne({ method: 'DELETE', url: `${CATEGORIES_URL}/4` })
      .flush({}, { status: 500, statusText: 'Server Error' });

    await expect(response).rejects.toMatchObject({ status: 500 });
  });
});
