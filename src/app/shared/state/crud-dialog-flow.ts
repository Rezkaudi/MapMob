import { signal } from '@angular/core';
import { statusAfter, statusChangeActionFor } from '../models/confirm-action';
import { CrudDialogRequest } from './crud-dialog-request';
import { CrudEntry } from './crud-entry';
import { CrudWriteActions } from './crud-write-actions';

/** Which dialog a list page shows, and what confirming it saves. */
export class CrudDialogFlow<TEntry extends CrudEntry, TDraft> {
  private readonly openRequest = signal<CrudDialogRequest<TEntry> | null>(null);
  readonly request = this.openRequest.asReadonly();

  constructor(private readonly actions: CrudWriteActions<TDraft>) {}

  openCreate(): void {
    this.openRequest.set({ type: 'form', mode: 'create', entry: null });
  }

  openEdit(entry: TEntry): void {
    this.openRequest.set({ type: 'form', mode: 'edit', entry });
  }

  openStatusChange(entry: TEntry): void {
    this.openRequest.set({ type: 'confirm', action: statusChangeActionFor(entry.status), entry });
  }

  openDelete(entry: TEntry): void {
    this.openRequest.set({ type: 'confirm', action: 'delete', entry });
  }

  close(): void {
    this.openRequest.set(null);
  }

  async submitDraft(draft: TDraft): Promise<void> {
    const request = this.openRequest();
    if (request?.type !== 'form') {
      return;
    }
    const isSaved = request.entry
      ? await this.actions.update(request.entry.id, draft)
      : await this.actions.create(draft);
    this.closeWhenSaved(isSaved);
  }

  async confirm(): Promise<void> {
    const request = this.openRequest();
    if (request?.type !== 'confirm') {
      return;
    }
    const isSaved =
      request.action === 'delete'
        ? await this.actions.remove(request.entry.id)
        : await this.actions.changeStatus(request.entry.id, statusAfter(request.action));
    this.closeWhenSaved(isSaved);
  }

  private closeWhenSaved(isSaved: boolean): void {
    if (isSaved) {
      this.close();
    }
  }
}
