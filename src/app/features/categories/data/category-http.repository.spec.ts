import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CategoryDraft } from '../models/category-draft';
import { buildCategory } from '../testing/category-fixture';
import { CategoryHttpRepository } from './category-http.repository';

const BASE_URL = 'https://api.test';
const DRAFT: CategoryDraft = { name: 'مخابز', kind: 'sub', parentId: 'm1', icon: 'store' };
const BAKERY = buildCategory({ id: 'c1', name: 'مخابز' });
const EMPTY_PAGE = { items: [], totalCount: 0, kindCounts: { all: 0, main: 0, sub: 0 } };

describe('CategoryHttpRepository', () => {
  let repository: CategoryHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoryHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(CategoryHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of categories with every filter', async () => {
    const response = firstValueFrom(
      repository.getCategories({
        pageIndex: 1,
        pageSize: 5,
        search: 'مطاعم',
        sort: 'name',
        kind: 'sub',
        status: 'active',
        parentId: 'm1',
      }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/categories`);
    const params = request.request.params;
    expect(params.keys().map((key) => [key, params.get(key)])).toEqual([
      ['pageIndex', '1'],
      ['pageSize', '5'],
      ['search', 'مطاعم'],
      ['sort', 'name'],
      ['kind', 'sub'],
      ['status', 'active'],
      ['parentId', 'm1'],
    ]);
    request.flush(EMPTY_PAGE);
    expect(await response).toEqual(EMPTY_PAGE);
  });

  it('sends only the page when no filter is set', async () => {
    const response = firstValueFrom(repository.getCategories({ pageIndex: 0, pageSize: 5 }));

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/categories`);
    expect(request.request.params.keys()).toEqual(['pageIndex', 'pageSize']);
    request.flush(EMPTY_PAGE);
    await response;
  });

  it('loads the main categories for the parent pickers', async () => {
    const response = firstValueFrom(repository.getMainCategories());

    http.expectOne(`${BASE_URL}/categories/main`).flush([{ id: 'm1', name: 'مطاعم' }]);
    expect(await response).toEqual([{ id: 'm1', name: 'مطاعم' }]);
  });

  it('creates, updates, changes the status of and deletes a category', async () => {
    const created = firstValueFrom(repository.createCategory(DRAFT));
    const createRequest = http.expectOne(`${BASE_URL}/categories`);
    expect(createRequest.request.method).toBe('POST');
    expect(createRequest.request.body).toEqual(DRAFT);
    createRequest.flush(BAKERY);
    expect(await created).toEqual(BAKERY);

    const updated = firstValueFrom(repository.updateCategory('c1', DRAFT));
    const updateRequest = http.expectOne(`${BASE_URL}/categories/c1`);
    expect(updateRequest.request.method).toBe('PUT');
    expect(updateRequest.request.body).toEqual(DRAFT);
    updateRequest.flush(BAKERY);
    await updated;

    const suspended = firstValueFrom(repository.setCategoryStatus('c1', 'suspended'));
    const statusRequest = http.expectOne(`${BASE_URL}/categories/c1/status`);
    expect(statusRequest.request.method).toBe('PATCH');
    expect(statusRequest.request.body).toEqual({ status: 'suspended' });
    statusRequest.flush(BAKERY);
    await suspended;

    const deleted = firstValueFrom(repository.deleteCategory('c1'), { defaultValue: null });
    const deleteRequest = http.expectOne(`${BASE_URL}/categories/c1`);
    expect(deleteRequest.request.method).toBe('DELETE');
    deleteRequest.flush(null);
    await deleted;
  });
});
