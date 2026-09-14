import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CrudDialogFlow } from '../../../../shared/state/crud-dialog-flow';
import { AddButton } from '../../../../shared/ui/add-button/add-button';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { RegionDraft } from '../../models/region-draft';
import { RegionEntry } from '../../models/region-entry';
import { GovernoratesStore } from '../../state/governorates.store';
import { RegionDialogs } from '../../ui/region-dialogs/region-dialogs';
import { RegionEmptyState } from '../../ui/region-empty-state/region-empty-state';
import { RegionEntryLink, RegionTable } from '../../ui/region-table/region-table';
import { RegionToolbar } from '../../ui/region-toolbar/region-toolbar';

const areasLinkOf: RegionEntryLink = (entry: RegionEntry) => ['/regions', entry.id, 'areas'];

@Component({
  selector: 'app-governorate-list',
  imports: [
    ErrorState,
    AddButton,
    RegionDialogs,
    RegionEmptyState,
    PageHeader,
    RegionTable,
    RegionToolbar,
    TablePagination,
    Toast,
  ],
  templateUrl: './governorate-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernorateList {
  protected readonly store = inject(GovernoratesStore);
  protected readonly areasLink = areasLinkOf;
  protected readonly dialogFlow = new CrudDialogFlow<RegionEntry, RegionDraft>({
    create: (draft) => this.store.createGovernorate(draft),
    update: (id, draft) => this.store.updateGovernorate(id, draft),
    changeStatus: (id, status) => this.store.changeStatus(id, status),
    remove: (id) => this.store.deleteGovernorate(id),
  });

  constructor() {
    this.store.loadGovernorates();
  }

  protected closeDialog(): void {
    this.dialogFlow.close();
    this.store.clearSaveError();
  }
}
