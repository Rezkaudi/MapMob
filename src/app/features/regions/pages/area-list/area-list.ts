import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { AreasStore } from '../../state/areas.store';
import { RegionAddButton } from '../../ui/region-add-button/region-add-button';
import { RegionDialogFlow } from '../../ui/region-dialog-flow';
import { RegionDialogs } from '../../ui/region-dialogs/region-dialogs';
import { RegionEmptyState } from '../../ui/region-empty-state/region-empty-state';
import { RegionPageHeader } from '../../ui/region-page-header/region-page-header';
import { RegionTable } from '../../ui/region-table/region-table';
import { RegionToolbar } from '../../ui/region-toolbar/region-toolbar';

@Component({
  selector: 'app-area-list',
  imports: [
    AppIcon,
    ErrorState,
    RegionAddButton,
    RegionDialogs,
    RegionEmptyState,
    RegionPageHeader,
    RegionTable,
    RegionToolbar,
    RouterLink,
    TablePagination,
    Toast,
  ],
  templateUrl: './area-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AreaList {
  /** Bound from the `:governorateId` route parameter. */
  readonly governorateId = input.required<string>();

  protected readonly store = inject(AreasStore);
  protected readonly dialogFlow = new RegionDialogFlow({
    create: (draft) => this.store.createArea(draft),
    update: (id, draft) => this.store.updateArea(id, draft),
    changeStatus: (id, status) => this.store.changeStatus(id, status),
    remove: (id) => this.store.deleteArea(id),
  });

  protected readonly title = computed(() => `مناطق ${this.store.governorateName()}`);
  protected readonly description = computed(
    () => `إدارة المناطق التابعة لمحافظة ${this.store.governorateName()} .`,
  );
  protected readonly emptyTitle = computed(
    () => `لا توجد مناطق مضافة في محافظة ${this.store.governorateName()} حتى الآن`,
  );

  constructor() {
    // Only the route id may re-run this; the store signals read while opening must not.
    effect(() => {
      const governorateId = this.governorateId();
      untracked(() => this.store.openGovernorate(governorateId));
    });
  }

  protected reload(): void {
    this.store.openGovernorate(this.governorateId());
  }

  protected closeDialog(): void {
    this.dialogFlow.close();
    this.store.clearSaveError();
  }
}
