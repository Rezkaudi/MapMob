import { signal } from '@angular/core';
import { statusAfter, statusChangeActionFor } from '../models/confirm-action';
import { ConfirmWriteActions } from './confirm-write-actions';
import { CrudDialogRequest } from './crud-dialog-request';
import { CrudEntry } from './crud-entry';

/** Which status or delete dialog a list page shows, and what confirming it saves. */
export class ConfirmDialogFlow<TEntry extends CrudEntry> {
  protected readonly openRequest = signal<CrudDialogRequest<TEntry> | null>(null);
  readonly request = this.openRequest.asReadonly();

  constructor(private readonly confirmActions: ConfirmWriteActions) {}

  openStatusChange(entry: TEntry): void {
    this.openRequest.set({ type: 'confirm', action: statusChangeActionFor(entry.status), entry });
  }

  openDelete(entry: TEntry): void {
    this.openRequest.set({ type: 'confirm', action: 'delete', entry });
  }

  close(): void {
    this.openRequest.set(null);
  }

  async confirm(): Promise<void> {
    const request = this.openRequest();
    if (request?.type !== 'confirm') {
      return;
    }
    const isSaved =
      request.action === 'delete'
        ? await this.confirmActions.remove(request.entry.id)
        : await this.confirmActions.changeStatus(request.entry.id, statusAfter(request.action));
    this.closeWhenSaved(isSaved);
  }

  protected closeWhenSaved(isSaved: boolean): void {
    if (isSaved) {
      this.close();
    }
  }
}
