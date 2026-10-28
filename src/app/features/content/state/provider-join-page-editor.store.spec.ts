import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ContentPageRepository } from '../data/content-page.repository';
import { ProviderJoinPageDraft } from '../models/provider-join-page-draft';
import { buildProviderJoinPage } from '../testing/content-fixture';
import { ProviderJoinPageEditorStore } from './provider-join-page-editor.store';

const DRAFT: ProviderJoinPageDraft = {
  ...buildProviderJoinPage({ registrationFormUrl: 'https://forms.app/new' }),
  status: 'published',
};

function createStore() {
  const saves: ProviderJoinPageDraft[] = [];
  let loads = 0;
  const repository: Partial<ContentPageRepository> = {
    getProviderJoinPage: () => {
      loads += 1;
      return of(buildProviderJoinPage());
    },
    saveProviderJoinPage: (draft) => {
      saves.push(draft);
      return of(buildProviderJoinPage({ registrationFormUrl: draft.registrationFormUrl }));
    },
  };
  TestBed.configureTestingModule({
    providers: [
      ProviderJoinPageEditorStore,
      { provide: ContentPageRepository, useValue: repository },
    ],
  });
  return { store: TestBed.inject(ProviderJoinPageEditorStore), saves, loadCount: () => loads };
}

describe('ProviderJoinPageEditorStore', () => {
  it('loads the join page, and again on retry', () => {
    const { store, loadCount } = createStore();

    store.load();
    store.retry();

    expect(store.page()).toEqual(buildProviderJoinPage());
    expect(loadCount()).toBe(2);
  });

  it('saves the draft once the page has loaded', async () => {
    const { store, saves } = createStore();

    expect(await store.save(DRAFT)).toBe(false);
    store.load();
    expect(await store.save(DRAFT)).toBe(true);

    expect(saves).toEqual([DRAFT]);
    expect(store.page()?.registrationFormUrl).toBe('https://forms.app/new');
    expect(store.savedStatus()).toBe('published');
  });
});
