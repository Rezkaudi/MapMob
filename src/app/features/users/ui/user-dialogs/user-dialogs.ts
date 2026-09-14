import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CrudDialogRequest } from '../../../../shared/state/crud-dialog-request';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { AppUser } from '../../models/user';
import { buildUserConfirmCopy } from '../user-dialog-copy';

@Component({
  selector: 'app-user-dialogs',
  imports: [ConfirmActionDialog],
  templateUrl: './user-dialogs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserDialogs {
  readonly request = input.required<CrudDialogRequest<AppUser> | null>();
  readonly isBusy = input<boolean>(false);
  readonly confirmed = output<void>();
  readonly closed = output<void>();

  protected readonly confirmCopy = computed(() => {
    const request = this.request();
    return request?.type === 'confirm' ? buildUserConfirmCopy(request.action, request.entry) : null;
  });
}
