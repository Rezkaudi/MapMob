import { Observable } from 'rxjs';
import { Category } from '../models/category';
import { CategoryDraft } from '../models/category-draft';
import { CategoryPage } from '../models/category-page';
import { CategoryQuery } from '../models/category-query';
import { CategoryStatus } from '../models/category-status';
import { MainCategory } from '../models/main-category';

export abstract class CategoryRepository {
  abstract getCategories(query: CategoryQuery): Observable<CategoryPage>;
  abstract getMainCategories(): Observable<readonly MainCategory[]>;
  abstract createCategory(draft: CategoryDraft): Observable<Category>;
  abstract updateCategory(id: string, draft: CategoryDraft): Observable<Category>;
  abstract setCategoryStatus(id: string, status: CategoryStatus): Observable<Category>;
  abstract deleteCategory(id: string): Observable<void>;
}
