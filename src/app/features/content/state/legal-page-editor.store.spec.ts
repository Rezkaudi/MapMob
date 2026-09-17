import { TestBed } from '@angular/core/testing';
import { Observable, of, throwError } from 'rxjs';
import { ContentPageRepository } from '../data/content-page.repository';
import { LegalPageKind } from '../models/content-page-kind';
import { LegalPageDraft } from '../models/legal-page-draft';
import { buildLegalPage } from '../testing/content-fixture';
import { LegalPageEditorStore } from './legal-page-editor.store';

const DRAFT: LegalPageDraft = { title: 'الخصوصية', body: '<p>جديد</p>', status: 'published' };

function createStore(overrides: Partial<ContentPageRepository> = {}) {
  const loadedKinds: LegalPageKind[] = [];
  const saves: [LegalPageKind, LegalPageDraft][] = [];
  const repository: Partial<ContentPageRepository> = {
    getLegalPage: (kind) => {
      loadedKinds.push(kind);
      return of(buildLegalPage());
    },
    saveLegalPage: (kind, draft) => {
      saves.push([kind, draft]);
      return of({ title: draft.title, body: draft.body });
    },
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [LegalPageEditorStore, { provide: ContentPageRepository, useValue: repository }],
  });
  return { store: TestBed.inject(LegalPageEditorStore), loadedKinds, saves };
}

describe('LegalPageEditorStore', () => {
  it('loads the page of the given kind', () => {
    const { store, loadedKinds } = createStore();

    store.load('privacy');

    expect(loadedKinds).toEqual(['privacy']);
    expect(store.page()).toEqual(buildLegalPage());
    expect(store.isLoading()).toBe(false);
  });

  it('reports a failed load and retries the same page', () => {
    const { store, loadedKinds } = createStore({
      getLegalPage: (kind): Observable<never> => {
        loadedKinds.push(kind);
        return throwError(() => new Error('تعذر تحميل الصفحة'));
      },
    });

    store.load('terms');
    store.retry();

    expect(store.error()).toBe('تعذر تحميل الصفحة');
    expect(loadedKinds).toEqual(['terms', 'terms']);
  });

  it('saves the draft to the loaded page and remembers how it was saved', async () => {
    const { store, saves } = createStore();
    store.load('privacy');

    expect(await store.save(DRAFT)).toBe(true);

    expect(saves).toEqual([['privacy', DRAFT]]);
    expect(store.page()).toEqual({ title: 'الخصوصية', body: '<p>جديد</p>' });
    expect(store.savedStatus()).toBe('published');

    store.dismissSavedMessage();
    expect(store.savedStatus()).toBeNull();
  });

  it('keeps the error when a save fails', async () => {
    const { store } = createStore({
      saveLegalPage: () => throwError(() => new Error('تعذر حفظ الصفحة')),
    });
    store.load('terms');

    expect(await store.save(DRAFT)).toBe(false);

    expect(store.saveError()).toBe('تعذر حفظ الصفحة');
    expect(store.savedStatus()).toBeNull();
  });

  it('does not save before a page has loaded', async () => {
    const { store, saves } = createStore();

    expect(await store.save(DRAFT)).toBe(false);
    expect(saves).toEqual([]);
  });
});
