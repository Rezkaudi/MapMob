import { PagedResult } from '../../../core/models/paged-result';
import { Category } from './category';
import { CategoryKindCounts } from './category-kind-counts';

export interface CategoryPage extends PagedResult<Category> {
  readonly kindCounts: CategoryKindCounts;
}
