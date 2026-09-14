import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CrudDialogFlow } from '../../../../shared/state/crud-dialog-flow';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { Category } from '../../models/category';
import { CategoryDraft } from '../../models/category-draft';
import { CategoriesStore } from '../../state/categories.store';
import { CategoryDialogs } from '../../ui/category-dialogs/category-dialogs';
import { CategoryTable } from '../../ui/category-table/category-table';
import { CategoryToolbar } from '../../ui/category-toolbar/category-toolbar';

@Component({
  selector: 'app-category-list',
  imports: [
    CategoryDialogs,
    CategoryTable,
    CategoryToolbar,
    ErrorState,
    PageHeader,
    TablePagination,
    Toast,
  ],
  templateUrl: './category-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryList {
  protected readonly store = inject(CategoriesStore);
  protected readonly dialogFlow = new CrudDialogFlow<Category, CategoryDraft>({
    create: (draft) => this.store.createCategory(draft),
    update: (id, draft) => this.store.updateCategory(id, draft),
    changeStatus: (id, status) => this.store.changeStatus(id, status),
    remove: (id) => this.store.deleteCategory(id),
  });

  constructor() {
    this.store.loadCategories();
    this.store.loadMainCategories();
  }

  protected closeDialog(): void {
    this.dialogFlow.close();
    this.store.clearSaveError();
  }
}
