import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { ContentPageRepository } from '../data/content-page.repository';
import { AboutPageDraft } from '../models/about-page-draft';
import { buildAboutPage } from '../testing/content-fixture';
import { AboutPageEditorStore } from './about-page-editor.store';

const DRAFT: AboutPageDraft = {
  ...buildAboutPage({ title: 'من نحن' }),
  banner: null,
  isBannerRemoved: true,
  status: 'draft',
};

function createStore(overrides: Partial<ContentPageRepository> = {}) {
  let loads = 0;
  const saves: AboutPageDraft[] = [];
  const repository: Partial<ContentPageRepository> = {
    getAboutPage: () => {
      loads += 1;
      return of(buildAboutPage());
    },
    saveAboutPage: (draft) => {
      saves.push(draft);
      return of(buildAboutPage({ title: draft.title, bannerUrl: null }));
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [AboutPageEditorStore, { provide: ContentPageRepository, useValue: repository }],
  });
  return { store: TestBed.inject(AboutPageEditorStore), saves, loadCount: () => loads };
}

describe('AboutPageEditorStore', () => {
  it('loads the about page, and loads it again on retry', () => {
    const { store, loadCount } = createStore();

    store.load();
    store.retry();

    expect(store.page()).toEqual(buildAboutPage());
    expect(loadCount()).toBe(2);
  });

  it('saves the draft and keeps what the server sent back', async () => {
    const { store, saves } = createStore();
    store.load();

    expect(await store.save(DRAFT)).toBe(true);

    expect(saves).toEqual([DRAFT]);
    expect(store.page()?.bannerUrl).toBeNull();
    expect(store.savedStatus()).toBe('draft');
  });

  it('reports a failed load', () => {
    const { store } = createStore({
      getAboutPage: () => throwError(() => new Error('تعذر التحميل')),
    });

    store.load();

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('does not save before the page has loaded', async () => {
    const { store, saves } = createStore();

    expect(await store.save(DRAFT)).toBe(false);
    expect(saves).toEqual([]);
  });
});
