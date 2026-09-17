import { inject } from '@angular/core';
import { patchState, signalStore, withMethods, withState } from '@ngrx/signals';
import { ContentPageRepository } from '../data/content-page.repository';
import { LegalPageKind } from '../models/content-page-kind';
import { LegalPage } from '../models/legal-page';
import { LegalPageDraft } from '../models/legal-page-draft';
import { withContentPageEditor } from './with-content-page-editor';

export const LegalPageEditorStore = signalStore(
  withState<{ kind: LegalPageKind | null }>({ kind: null }),
  withContentPageEditor<LegalPage>(),
  withMethods((store, repository = inject(ContentPageRepository)) => ({
    load(kind: LegalPageKind): void {
      patchState(store, { kind });
      store.loadPageWith({ fetch: () => repository.getLegalPage(kind) });
    },
    retry(): void {
      const kind = store.kind();
      if (kind) {
        store.loadPageWith({ fetch: () => repository.getLegalPage(kind) });
      }
    },
    async save(draft: LegalPageDraft): Promise<boolean> {
      const kind = store.kind();
      if (!kind || !store.page()) {
        return false;
      }
      return store.savePageWith(repository.saveLegalPage(kind, draft), draft.status);
    },
  })),
);
