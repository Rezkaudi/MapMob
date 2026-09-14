import { paginate } from '../../../../mock/paginate';
import { sortListEntries } from '../../../../mock/sort-list-entries';
import { Category } from '../models/category';
import { CategoryKindCounts } from '../models/category-kind-counts';
import { CategoryPage } from '../models/category-page';
import { CategoryQuery } from '../models/category-query';

export function queryCategories(
  categories: readonly Category[],
  query: CategoryQuery,
): CategoryPage {
  const matching = categories.filter((category) => matchesFilters(category, query));
  const ofKind = query.kind
    ? matching.filter((category) => category.kind === query.kind)
    : matching;
  const page = paginate(sortListEntries(ofKind, query.sort), query.pageIndex, query.pageSize);
  return { ...page, kindCounts: countKinds(matching) };
}

function matchesFilters(category: Category, query: CategoryQuery): boolean {
  const search = query.search?.trim();
  if (search && !category.name.includes(search)) {
    return false;
  }
  if (query.status && category.status !== query.status) {
    return false;
  }
  if (query.parentId) {
    return category.id === query.parentId || category.parentId === query.parentId;
  }
  return true;
}

function countKinds(categories: readonly Category[]): CategoryKindCounts {
  const main = categories.filter((category) => category.kind === 'main').length;
  return { all: categories.length, main, sub: categories.length - main };
}
