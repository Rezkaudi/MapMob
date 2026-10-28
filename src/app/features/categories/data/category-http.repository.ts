import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, from, map, of, switchMap } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveEnvelope } from '../../../core/http/live-envelope';
import { Category } from '../models/category';
import { CategoryDraft } from '../models/category-draft';
import { CategoryPage } from '../models/category-page';
import { CategoryQuery } from '../models/category-query';
import { CategoryStatus } from '../models/category-status';
import { MainCategory } from '../models/main-category';
import { queryCategories } from './category-list-query';
import { CategoryIconFileMaker } from './category-icon-file-maker';
import { CategoryRepository } from './category.repository';
import { LiveCategory } from './live-category';
import { toCategory, toLiveCategoryForm } from './live-category-mapping';

// There are few categories, so one big page brings them all; the kind counts need them all.
const ALL_CATEGORIES_PAGE_SIZE = 1000;
const MAIN_CATEGORY_PARENT_ID = '';

@Injectable()
export class CategoryHttpRepository implements CategoryRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly iconFileMaker = inject(CategoryIconFileMaker);
  private readonly categoriesUrl = `${inject(API_BASE_URL)}/admin/categories`;

  getCategories(query: CategoryQuery): Observable<CategoryPage> {
    return this.loadAll().pipe(map((categories) => queryCategories(categories, query)));
  }

  // The server reads `parent_id=null` as the word "null"; an empty value means "no parent".
  getMainCategories(): Observable<readonly MainCategory[]> {
    return this.loadLive({ parent_id: MAIN_CATEGORY_PARENT_ID }).pipe(
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
    return this.httpClient.delete(`${this.categoriesUrl}/${id}`).pipe(map(() => undefined));
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
    return this.loadLive().pipe(map((all) => toCategory(saved, all)));
  }

  private loadAll(): Observable<readonly Category[]> {
    return this.loadLive().pipe(map((all) => all.map((category) => toCategory(category, all))));
  }

  private loadLive(filters: Record<string, string> = {}): Observable<readonly LiveCategory[]> {
    return this.httpClient
      .get<LiveEnvelope<readonly LiveCategory[]>>(this.categoriesUrl, {
        params: { ...filters, per_page: ALL_CATEGORIES_PAGE_SIZE },
      })
      .pipe(map(({ data }) => data));
  }
}
