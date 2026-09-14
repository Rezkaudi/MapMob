import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { mockRequest } from '../../../../mock/mock-delay';
import { Category } from '../models/category';
import { CategoryDraft } from '../models/category-draft';
import { CategoryPage } from '../models/category-page';
import { CategoryQuery } from '../models/category-query';
import { CategoryStatus } from '../models/category-status';
import { MainCategory } from '../models/main-category';
import { CategoryMockDatabase } from './category-mock-database';
import { queryCategories } from './category-mock-query';
import { CategoryRepository } from './category.repository';

@Injectable()
export class CategoryMockRepository implements CategoryRepository {
  private readonly database = inject(CategoryMockDatabase);

  getCategories(query: CategoryQuery): Observable<CategoryPage> {
    return mockRequest(() => queryCategories(this.database.list(), query));
  }

  getMainCategories(): Observable<readonly MainCategory[]> {
    return mockRequest(() => this.database.listMain());
  }

  createCategory(draft: CategoryDraft): Observable<Category> {
    return mockRequest(() => this.database.add(draft));
  }

  updateCategory(id: string, draft: CategoryDraft): Observable<Category> {
    return mockRequest(() => this.database.update(id, draft));
  }

  setCategoryStatus(id: string, status: CategoryStatus): Observable<Category> {
    return mockRequest(() => this.database.setStatus(id, status));
  }

  deleteCategory(id: string): Observable<void> {
    return mockRequest(() => this.database.remove(id));
  }
}
