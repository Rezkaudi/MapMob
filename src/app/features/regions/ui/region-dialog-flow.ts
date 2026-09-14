import { signal } from '@angular/core';
import { statusAfter, statusChangeActionFor } from '../models/region-confirm-action';
import { RegionDraft } from '../models/region-draft';
import { RegionEntry } from '../models/region-entry';
import { RegionDialogRequest } from './region-dialog-request';
import { RegionWriteActions } from './region-write-actions';

/** Which dialog a region page shows, and what confirming it saves. */
export class RegionDialogFlow {
  private readonly openRequest = signal<RegionDialogRequest | null>(null);
  readonly request = this.openRequest.asReadonly();

  constructor(private readonly actions: RegionWriteActions) {}

  openCreate(): void {
    this.openRequest.set({ type: 'form', mode: 'create', entry: null });
  }

  openEdit(entry: RegionEntry): void {
    this.openRequest.set({ type: 'form', mode: 'edit', entry });
  }

  openStatusChange(entry: RegionEntry): void {
    this.openRequest.set({ type: 'confirm', action: statusChangeActionFor(entry.status), entry });
  }

  openDelete(entry: RegionEntry): void {
    this.openRequest.set({ type: 'confirm', action: 'delete', entry });
  }

  close(): void {
    this.openRequest.set(null);
  }

  async submitDraft(draft: RegionDraft): Promise<void> {
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
