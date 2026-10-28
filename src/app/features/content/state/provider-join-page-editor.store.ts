import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { ContentPageRepository } from '../data/content-page.repository';
import { ProviderJoinPage } from '../models/provider-join-page';
import { ProviderJoinPageDraft } from '../models/provider-join-page-draft';
import { withContentPageEditor } from './with-content-page-editor';

export const ProviderJoinPageEditorStore = signalStore(
  withContentPageEditor<ProviderJoinPage>(),
  withMethods((store, repository = inject(ContentPageRepository)) => ({
    load(): void {
      store.loadPageWith({ fetch: () => repository.getProviderJoinPage() });
    },
    retry(): void {
      store.loadPageWith({ fetch: () => repository.getProviderJoinPage() });
    },
    async save(draft: ProviderJoinPageDraft): Promise<boolean> {
      if (!store.page()) {
        return false;
      }
      return store.savePageWith(repository.saveProviderJoinPage(draft), draft.status);
    },
  })),
);
