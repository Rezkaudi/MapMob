import { ConfirmDialogFlow } from './confirm-dialog-flow';
import { CrudEntry } from './crud-entry';
import { CrudWriteActions } from './crud-write-actions';

/** Adds the add and edit form to the status and delete dialogs. */
export class CrudDialogFlow<TEntry extends CrudEntry, TDraft> extends ConfirmDialogFlow<TEntry> {
  constructor(private readonly actions: CrudWriteActions<TDraft>) {
    super(actions);
  }

  openCreate(): void {
    this.openRequest.set({ type: 'form', mode: 'create', entry: null });
  }

  openEdit(entry: TEntry): void {
    this.openRequest.set({ type: 'form', mode: 'edit', entry });
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
}
