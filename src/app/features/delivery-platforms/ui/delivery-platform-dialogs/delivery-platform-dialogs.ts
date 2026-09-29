import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CrudDialogRequest } from '../../../../shared/state/crud-dialog-request';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { DeliveryPlatformDraft } from '../../models/delivery-platform-draft';
import { DeliveryPlatformEntry } from '../../models/delivery-platform-entry';
import { buildDeliveryPlatformConfirmCopy } from '../delivery-platform-dialog-copy';
import { DeliveryPlatformFormDialog } from '../delivery-platform-form-dialog/delivery-platform-form-dialog';

@Component({
  selector: 'app-delivery-platform-dialogs',
  imports: [ConfirmActionDialog, DeliveryPlatformFormDialog],
  templateUrl: './delivery-platform-dialogs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPlatformDialogs {
  readonly request = input.required<CrudDialogRequest<DeliveryPlatformEntry> | null>();
  readonly suggestedSortOrder = input.required<number>();
  readonly isBusy = input<boolean>(false);
  readonly draftSubmitted = output<DeliveryPlatformDraft>();
  readonly confirmed = output<void>();
  readonly closed = output<void>();

  protected readonly form = computed(() => {
    const request = this.request();
    if (request?.type !== 'form') {
      return null;
    }
    const entry = request.entry;
    return {
      mode: request.mode,
      draft: entry
        ? {
            name: entry.name,
            latinName: entry.latinName,
            websiteUrl: entry.websiteUrl,
            status: entry.status,
            sortOrder: entry.sortOrder,
            logoFile: null,
            logoUrl: entry.logoUrl,
          }
        : null,
    };
  });

  protected readonly confirmCopy = computed(() => {
    const request = this.request();
    return request?.type === 'confirm'
      ? buildDeliveryPlatformConfirmCopy(request.action, request.entry)
      : null;
  });
}
