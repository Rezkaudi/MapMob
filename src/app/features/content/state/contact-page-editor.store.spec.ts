import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContentPageRepository } from '../data/content-page.repository';
import { ContactPageDraft } from '../models/contact-page-draft';
import { buildContactPage } from '../testing/content-fixture';
import { ContactPageEditorStore } from './contact-page-editor.store';

const DRAFT: ContactPageDraft = {
  ...buildContactPage({ supportPhone: '+1' }),
  status: 'published',
};

function createStore() {
  const saves: ContactPageDraft[] = [];
  let loads = 0;
  const repository: Partial<ContentPageRepository> = {
    getContactPage: () => {
      loads += 1;
      return of(buildContactPage());
    },
    saveContactPage: (draft) => {
      saves.push(draft);
      return of(buildContactPage({ supportPhone: draft.supportPhone }));
    },
  };
  TestBed.configureTestingModule({
    providers: [ContactPageEditorStore, { provide: ContentPageRepository, useValue: repository }],
  });
  return { store: TestBed.inject(ContactPageEditorStore), saves, loadCount: () => loads };
}

describe('ContactPageEditorStore', () => {
  it('loads the contact page, and again on retry', () => {
    const { store, loadCount } = createStore();

    store.load();
    store.retry();

    expect(store.page()).toEqual(buildContactPage());
    expect(loadCount()).toBe(2);
  });

  it('saves the draft once the page has loaded', async () => {
    const { store, saves } = createStore();

    expect(await store.save(DRAFT)).toBe(false);
    store.load();
    expect(await store.save(DRAFT)).toBe(true);

    expect(saves).toEqual([DRAFT]);
    expect(store.page()?.supportPhone).toBe('+1');
    expect(store.savedStatus()).toBe('published');
  });
});
