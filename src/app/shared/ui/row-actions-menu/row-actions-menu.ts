import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ActionMenu } from '../action-menu/action-menu';
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
