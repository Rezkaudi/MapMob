import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { ListSort } from '../../../shared/models/list-sort';
import { withListTable } from '../../../shared/state/with-list-table';
import { ChipOption } from '../../../shared/ui/filter-chips/chip-option';
import { SelectOption } from '../../../shared/ui/select-field/select-option';
import { CategoryRepository } from '../data/category.repository';
import { Category } from '../models/category';
import { CategoryDraft } from '../models/category-draft';
import { CategoryKindChip, CATEGORY_KIND_CHIP_LABEL } from '../models/category-kind-chip';
import { CategoryKindCounts } from '../models/category-kind-counts';
import { CategoryQuery } from '../models/category-query';
import { CategoryStatus } from '../models/category-status';
import { MainCategory } from '../models/main-category';

interface CategoriesState {
  readonly kindChip: CategoryKindChip;
  readonly statusFilter: CategoryStatus | null;
  readonly parentFilter: string | null;
  readonly kindCounts: CategoryKindCounts;
  readonly mainCategories: readonly MainCategory[];
}

const initialState: CategoriesState = {
  kindChip: 'all',
  statusFilter: null,
  parentFilter: null,
  kindCounts: { all: 0, main: 0, sub: 0 },
  mainCategories: [],
};

const KIND_CHIPS = Object.keys(CATEGORY_KIND_CHIP_LABEL) as CategoryKindChip[];
const NO_CATEGORIES_MESSAGE = 'لا توجد تصنيفات مضافة حتى الآن';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة لبحثك';

export const CategoriesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<Category>(),
  withComputed(({ kindChip, kindCounts, mainCategories, parentFilter, search, statusFilter }) => ({
    emptyMessage: computed(() => {
      const hasFilters =
        search().trim() !== '' || kindChip() !== 'all' || !!statusFilter() || !!parentFilter();
      return hasFilters ? NO_MATCHES_MESSAGE : NO_CATEGORIES_MESSAGE;
    }),
    kindChips: computed<readonly ChipOption[]>(() =>
      KIND_CHIPS.map((chip) => ({
        value: chip,
        label: CATEGORY_KIND_CHIP_LABEL[chip],
        count: kindCounts()[chip],
      })),
    ),
    mainCategoryOptions: computed<readonly SelectOption[]>(() =>
      mainCategories().map(({ id, name }) => ({ value: id, label: name })),
    ),
  })),
  withMethods((store, repository = inject(CategoryRepository)) => {
    const currentCategoryQuery = (): CategoryQuery => {
      const kindChip = store.kindChip();
      const status = store.statusFilter();
      const parentId = store.parentFilter();
      return {
        ...store.currentQuery(),
        ...(kindChip !== 'all' ? { kind: kindChip } : {}),
        ...(status ? { status } : {}),
        ...(parentId ? { parentId } : {}),
      };
    };

    const loadCategories = rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getCategories(currentCategoryQuery()).pipe(
            tap((page) => {
              if (store.showPage(page)) {
                loadCategories();
                return;
              }
              patchState(store, { kindCounts: page.kindCounts });
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    );

    return {
      loadCategories,

      loadMainCategories: rxMethod<void>(
        pipe(
          switchMap(() =>
            repository.getMainCategories().pipe(
              tap((mainCategories) => patchState(store, { mainCategories })),
              catchError(() => of(null)),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store, repository = inject(CategoryRepository)) => {
    const reloadAll = () => {
      store.loadCategories();
      store.loadMainCategories();
    };
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, reloadAll, onSaved);
    const filterThenReload = (patch: Partial<CategoriesState>) => {
      patchState(store, patch);
      store.resetToFirstPage();
      store.loadCategories();
    };

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadCategories();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadCategories();
      },
      setKindChip(kindChip: CategoryKindChip): void {
        filterThenReload({ kindChip });
      },
      setStatusFilter(statusFilter: CategoryStatus | null): void {
        filterThenReload({ statusFilter });
      },
      setParentFilter(parentFilter: string | null): void {
        filterThenReload({ parentFilter });
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadCategories();
      },
      createCategory(draft: CategoryDraft): Promise<boolean> {
        return saveThenReload(repository.createCategory(draft));
      },
      updateCategory(id: string, draft: CategoryDraft): Promise<boolean> {
        return saveThenReload(repository.updateCategory(id, draft));
      },
      changeStatus(id: string, status: CategoryStatus): Promise<boolean> {
        return saveThenReload(repository.setCategoryStatus(id, status));
      },
      deleteCategory(id: string): Promise<boolean> {
        return saveThenReload(repository.deleteCategory(id), () => store.forgetRemovedEntry(id));
      },
    };
  }),
);
