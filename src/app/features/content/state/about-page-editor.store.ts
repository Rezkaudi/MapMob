import { inject } from '@angular/core';
import { signalStore, withMethods } from '@ngrx/signals';
import { ContentPageRepository } from '../data/content-page.repository';
import { AboutPage } from '../models/about-page';
import { AboutPageDraft } from '../models/about-page-draft';
import { withContentPageEditor } from './with-content-page-editor';

export const AboutPageEditorStore = signalStore(
  withContentPageEditor<AboutPage>(),
  withMethods((store, repository = inject(ContentPageRepository)) => ({
    load(): void {
      store.loadPageWith({ fetch: () => repository.getAboutPage() });
    },
    retry(): void {
      store.loadPageWith({ fetch: () => repository.getAboutPage() });
    },
    async save(draft: AboutPageDraft): Promise<boolean> {
      if (!store.page()) {
        return false;
      }
      return store.savePageWith(repository.saveAboutPage(draft), draft.status);
    },
  })),
);
