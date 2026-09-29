import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CrudDialogFlow } from '../../../../shared/state/crud-dialog-flow';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { DeliveryPlatformDraft } from '../../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../../models/delivery-platform-entry';
import { DeliveryPlatformsStore } from '../../state/delivery-platforms.store';
import { LinkedStoresStore } from '../../state/linked-stores.store';
import { DeliveryPlatformDialogs } from '../../ui/delivery-platform-dialogs/delivery-platform-dialogs';
import { DeliveryPlatformStatCards } from '../../ui/delivery-platform-stat-cards/delivery-platform-stat-cards';
import { DeliveryPlatformTable } from '../../ui/delivery-platform-table/delivery-platform-table';
import { DeliveryPlatformToolbar } from '../../ui/delivery-platform-toolbar/delivery-platform-toolbar';
import { LinkedStoresDialog } from '../../ui/linked-stores-dialog/linked-stores-dialog';

@Component({
  selector: 'app-delivery-platform-list',
  imports: [
    DeliveryPlatformDialogs,
    DeliveryPlatformStatCards,
    DeliveryPlatformTable,
    DeliveryPlatformToolbar,
    ErrorState,
    LinkedStoresDialog,
    PageHeader,
    TablePagination,
    Toast,
  ],
  providers: [LinkedStoresStore],
  templateUrl: './delivery-platform-list.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPlatformList {
  protected readonly store = inject(DeliveryPlatformsStore);
  protected readonly linkedStores = inject(LinkedStoresStore);
  protected readonly dialogFlow = new CrudDialogFlow<DeliveryPlatformEntry, DeliveryPlatformDraft>({
    create: (draft) => this.store.createPlatform(draft),
    update: (id, draft) => this.store.updatePlatform(id, draft),
    changeStatus: (id, status) => this.store.changeStatus(id, status),
    remove: (id) => this.store.deletePlatform(id),
  });

  constructor() {
    this.store.loadPlatforms();
    this.store.loadSummary();
  }

  protected closeDialog(): void {
    this.dialogFlow.close();
    this.store.clearSaveError();
  }
}
