import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { Category } from '../models/category';
import { CategoryDraft } from '../models/category-draft';
import { CategoryPage } from '../models/category-page';
import { CategoryQuery } from '../models/category-query';
import { CategoryStatus } from '../models/category-status';
import { MainCategory } from '../models/main-category';
import { toCategoryQueryParams } from './category-query-params';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryHttpRepository implements CategoryRepository {
  private readonly httpClient = inject(HttpClient);
  private readonly categoriesUrl = `${inject(API_BASE_URL)}/categories`;

  getCategories(query: CategoryQuery): Observable<CategoryPage> {
    return this.httpClient.get<CategoryPage>(this.categoriesUrl, {
      params: toCategoryQueryParams(query),
    });
  }

  getMainCategories(): Observable<readonly MainCategory[]> {
    return this.httpClient.get<readonly MainCategory[]>(`${this.categoriesUrl}/main`);
  }

  createCategory(draft: CategoryDraft): Observable<Category> {
    return this.httpClient.post<Category>(this.categoriesUrl, draft);
  }

  updateCategory(id: string, draft: CategoryDraft): Observable<Category> {
    return this.httpClient.put<Category>(`${this.categoriesUrl}/${id}`, draft);
  }

  setCategoryStatus(id: string, status: CategoryStatus): Observable<Category> {
    return this.httpClient.patch<Category>(`${this.categoriesUrl}/${id}/status`, { status });
  }

  deleteCategory(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.categoriesUrl}/${id}`);
  }
}
