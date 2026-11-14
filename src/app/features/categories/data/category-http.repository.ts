import { LIVE_MAX_PAGE_SIZE } from '../../../core/http/live-max-page-size';
import { LiveMetaPage, readAllMetaPages } from '../../../core/http/read-all-meta-pages';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, from, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { LivePage } from '../../../core/http/live-page';
import { withPageNumber } from '../../../core/http/live-page-number-params';
import { replaceRefusalMessage } from '../../../core/http/replace-refusal-message';
import { PagedQuery } from '../../../core/models/paged-query';
import { Category } from '../models/category';
import { CategoryDraft } from '../models/category-draft';
import { CategoryPage } from '../models/category-page';
import { CategoryQuery } from '../models/category-query';
import { CategoryStatus } from '../models/category-status';
import { MainCategory } from '../models/main-category';
import { MAIN_CATEGORY_PARENT_ID, toCategoryFilterParams } from './category-query-params';
import { CategoryIconFileMaker } from './category-icon-file-maker';
import { CategoryRepository } from './category.repository';
import { LiveCategory } from './live-category';
import { toCategory, toLiveCategoryForm } from './live-category-mapping';

// The parent choices of the form: one long page holds every main category.
// A page of one row is enough to read the server's total.
const COUNT_ONLY_PAGE: PagedQuery = { pageIndex: 0, pageSize: 1 };

export const CATEGORY_HAS_CHILDREN_MESSAGE =
  'لا يمكن حذف هذا التصنيف لأن له تصنيفات فرعية. احذفها أو انقلها إلى تصنيف آخر أولاً.';

@Injectable()
export class CategoryHttpRepository implements CategoryRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly iconFileMaker = inject(CategoryIconFileMaker);
  private readonly categoriesUrl = `${inject(API_BASE_URL)}/admin/categories`;

  // A sub category names its parent in English, so the main categories give the Arabic name.
  getCategories(query: CategoryQuery): Observable<CategoryPage> {
    return forkJoin({
      page: this.readPage(toCategoryFilterParams(query), query),
      allCount: this.countMatching({ ...query, kind: undefined }),
      mainCount: this.countMatching({ ...query, kind: 'main' }),
      mains: this.loadMainCategories(),
    }).pipe(
      map(({ page, allCount, mainCount, mains }) => ({
        items: page.data.map((category) => toCategory(category, mains)),
        totalCount: page.meta.total,
        kindCounts: { all: allCount, main: mainCount, sub: allCount - mainCount },
      })),
    );
  }

  // The server reads `parent_id=null` as the word "null"; an empty value means "no parent".
  getMainCategories(): Observable<readonly MainCategory[]> {
    return this.loadMainCategories().pipe(
      map((categories) =>
        categories.map((category) => {
          const { id, name } = toCategory(category, categories);
          return { id, name };
        }),
      ),
    );
  }

  createCategory(draft: CategoryDraft): Observable<Category> {
    return this.sendForm(this.categoriesUrl, draft, null);
  }

  // PHP reads form fields on POST only, so the update names its real method in the body.
  updateCategory(id: string, draft: CategoryDraft): Observable<Category> {
    return this.sendForm(`${this.categoriesUrl}/${id}`, draft, 'PUT');
  }

  setCategoryStatus(id: string, status: CategoryStatus): Observable<Category> {
    return this.httpClient
      .put<LiveEnvelope<LiveCategory>>(`${this.categoriesUrl}/${id}`, {
        is_active: status === 'active',
      })
      .pipe(switchMap(({ data }) => this.withParentNames(data)));
  }

  deleteCategory(id: string): Observable<void> {
    return this.httpClient.delete(`${this.categoriesUrl}/${id}`).pipe(
      map(() => undefined),
      replaceRefusalMessage(CATEGORY_HAS_CHILDREN_MESSAGE),
    );
  }

  private sendForm(url: string, draft: CategoryDraft, method: 'PUT' | null): Observable<Category> {
    const iconFile = draft.icon
      ? from(this.iconFileMaker.makeFile(draft.icon, draft.color))
      : of(null);
    return iconFile.pipe(
      switchMap((file) => {
        const form = toLiveCategoryForm(draft, file);
        if (method) {
          form.set('_method', method);
        }
        return this.httpClient.post<LiveEnvelope<LiveCategory>>(url, form);
      }),
      switchMap(({ data }) => this.withParentNames(data)),
    );
  }

  // A saved sub category names its parent in English, so the list supplies the Arabic name.
  private withParentNames(saved: LiveCategory): Observable<Category> {
    return this.loadMainCategories().pipe(map((mains) => toCategory(saved, mains)));
  }

  private readPage(filters: HttpParams, query: PagedQuery): Observable<LivePage<LiveCategory>> {
    return this.httpClient.get<LivePage<LiveCategory>>(this.categoriesUrl, {
      params: withPageNumber(filters, query),
    });
  }

  private countMatching(query: CategoryQuery): Observable<number> {
    return this.readPage(toCategoryFilterParams(query), COUNT_ONLY_PAGE).pipe(
      map((page) => page.meta.total),
    );
  }

  private loadMainCategories(): Observable<readonly LiveCategory[]> {
    return readAllMetaPages((page) =>
      this.httpClient.get<LiveMetaPage<LiveCategory>>(this.categoriesUrl, {
        params: new HttpParams()
          .set('parent_id', MAIN_CATEGORY_PARENT_ID)
          .set('page', page)
          .set('per_page', LIVE_MAX_PAGE_SIZE),
      }),
    );
  }
}
