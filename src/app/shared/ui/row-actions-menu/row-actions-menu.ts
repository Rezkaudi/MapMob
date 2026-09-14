import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { ActionMenu } from '../action-menu/action-menu';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-row-actions-menu',
  imports: [ActionMenu, AppIcon],
  templateUrl: './row-actions-menu.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RowActionsMenu {
  readonly edit = output<void>();
  readonly statusChange = output<void>();
  readonly remove = output<void>();
}
