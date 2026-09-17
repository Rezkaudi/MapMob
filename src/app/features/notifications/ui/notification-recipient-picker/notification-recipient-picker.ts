import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { NotificationRecipient } from '../../models/notification-recipient';

const SKELETON_ROWS = [1, 2, 3];

/** The "Sub-View: مستخدمون محددون" frame: a search box over a list of recipients to tick. */
@Component({
  selector: 'app-notification-recipient-picker',
  imports: [AppIcon, Skeleton],
  templateUrl: './notification-recipient-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationRecipientPicker {
  readonly recipients = input.required<readonly NotificationRecipient[]>();
  readonly selectedIds = input.required<readonly string[]>();
  readonly isLoading = input<boolean>(false);
  readonly error = input<string | null>(null);
  readonly searchChange = output<string>();
  readonly selectedIdsChange = output<readonly string[]>();

  protected readonly skeletonRows = SKELETON_ROWS;
  protected readonly selectedIdSet = computed(() => new Set(this.selectedIds()));

  protected toggle(id: string): void {
    const selectedIds = this.selectedIds();
    this.selectedIdsChange.emit(
      this.selectedIdSet().has(id)
        ? selectedIds.filter((selected) => selected !== id)
        : [...selectedIds, id],
    );
  }

  protected search(event: Event): void {
    this.searchChange.emit((event.target as HTMLInputElement).value);
  }
}
