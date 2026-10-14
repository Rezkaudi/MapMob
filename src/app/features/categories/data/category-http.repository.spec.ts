import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CategoryDraft } from '../models/category-draft';
import { LIVE_MAIN_CATEGORY, LIVE_SUB_CATEGORY } from '../testing/live-category-fixture';
import { CategoryHttpRepository } from './category-http.repository';
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

  function answerAll(): void {
    http
      .expectOne((request) => request.url === CATEGORIES_URL && request.method === 'GET')
      .flush({ data: [LIVE_MAIN_CATEGORY, LIVE_SUB_CATEGORY], meta: { total: 2 } });
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

  it('reads every category in one call and filters, pages and counts them here', async () => {
    const response = firstValueFrom(
      repository.getCategories({ pageIndex: 0, pageSize: 5, kind: 'sub' }),
    );

    const request = http.expectOne((candidate) => candidate.url === CATEGORIES_URL);
    expect(request.request.params.get('per_page')).toBe('1000');
    request.flush({ data: [LIVE_MAIN_CATEGORY, LIVE_SUB_CATEGORY], meta: { total: 2 } });

    const page = await response;
    expect(page.items.map((category) => category.id)).toEqual(['17']);
    expect(page.kindCounts).toEqual({ all: 2, main: 1, sub: 1 });
  });

  it('offers only main categories as parents', async () => {
    const response = firstValueFrom(repository.getMainCategories());
    answerAll();

    expect(await response).toEqual([{ id: '1', name: 'مطاعم' }]);
  });

  it('creates a category with the picked icon drawn as a file', async () => {
    const response = firstValueFrom(repository.createCategory(DRAFT));
    await settle();

    const request = http.expectOne({ method: 'POST', url: CATEGORIES_URL });
    const body = request.request.body as FormData;
    expect(body.get('icon')).toBe(ICON_FILE);
    expect(body.get('parent_id')).toBe('1');
    request.flush({ data: LIVE_SUB_CATEGORY });
    answerAll();

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
    answerAll();

    expect((await response).parentName).toBe('مطاعم');
    expect(madeIcons).toEqual([]);
  });

  it('switches a category on or off with a PUT', async () => {
    const response = firstValueFrom(repository.setCategoryStatus('17', 'active'));

    const request = http.expectOne({ method: 'PUT', url: `${CATEGORIES_URL}/17` });
    expect(request.request.body).toEqual({ is_active: true });
    request.flush({ data: { ...LIVE_SUB_CATEGORY, is_active: true } });
    answerAll();

    expect((await response).status).toBe('active');
  });

  it('deletes one category', async () => {
    const response = firstValueFrom(repository.deleteCategory('17'));

    http.expectOne({ method: 'DELETE', url: `${CATEGORIES_URL}/17` }).flush({});

    expect(await response).toBeUndefined();
  });
});
