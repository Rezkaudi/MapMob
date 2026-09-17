import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { ContentPageRepository } from '../data/content-page.repository';
import { ContactPage } from '../models/contact-page';
import { ContactPageDraft } from '../models/contact-page-draft';
import { withContentPageEditor } from './with-content-page-editor';

export const ContactPageEditorStore = signalStore(
  withContentPageEditor<ContactPage>(),
  withMethods((store, repository = inject(ContentPageRepository)) => ({
    load(): void {
      store.loadPageWith({ fetch: () => repository.getContactPage() });
    },
    retry(): void {
      store.loadPageWith({ fetch: () => repository.getContactPage() });
    },
    async save(draft: ContactPageDraft): Promise<boolean> {
      if (!store.page()) {
        return false;
      }
      return store.savePageWith(repository.saveContactPage(draft), draft.status);
    },
  })),
);
