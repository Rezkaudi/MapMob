import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ActionMenu, ActionMenuTriggerTone } from '../action-menu/action-menu';
import { AppIcon } from '../app-icon/app-icon';

/** Regions and categories edit a row in place; the users table opens its detail page instead. */
export type RowPrimaryAction = 'edit' | 'view';

interface PrimaryItem {
  readonly label: string;
  readonly icon: string;
  readonly iconSize: number;
}

const PRIMARY_ITEMS: Record<RowPrimaryAction, PrimaryItem> = {
  edit: { label: 'تعديل', icon: 'edit-filled', iconSize: 14 },
  view: { label: 'عرض التفاصيل', icon: 'eye-filled', iconSize: 16.5 },
};

@Component({
  selector: 'app-row-actions-menu',
  imports: [ActionMenu, AppIcon],
  templateUrl: './row-actions-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActionsMenu {
  readonly primaryAction = input<RowPrimaryAction>('edit');
  /** The subscriptions table has no per-row edit screen yet, so it drops the first item. */
  readonly isPrimaryVisible = input<boolean>(true);
  /** Reviews change their status from the detail drawer, so their menu leaves this out. */
  readonly isStatusChangeVisible = input<boolean>(true);
  /** The featured package card carries the menu on dark blue. */
  readonly triggerTone = input<ActionMenuTriggerTone>('default');
  readonly edit = output<void>();
  readonly view = output<void>();
  readonly statusChange = output<void>();
  readonly remove = output<void>();

  protected readonly primaryItem = computed(() => PRIMARY_ITEMS[this.primaryAction()]);

  protected pickPrimary(): void {
    if (this.primaryAction() === 'view') {
      this.view.emit();
      return;
    }
    this.edit.emit();
  }
}
