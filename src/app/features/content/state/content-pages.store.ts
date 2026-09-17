import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSelection } from '../../../shared/state/with-selection';
import { ContentPageRepository } from '../data/content-page.repository';
import { ContentPage } from '../models/content-page';

interface ContentPagesState {
  readonly pages: readonly ContentPage[];
  readonly search: string;
}

const initialState: ContentPagesState = { pages: [], search: '' };

export const ContentPagesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withSelection(),
  withComputed(({ pages, search, selectedIdSet, isLoading }) => {
    const visiblePages = computed(() => {
      const term = search().trim();
      return term ? pages().filter((page) => page.title.includes(term)) : pages();
    });
    return {
      visiblePages,
      hasNoResults: computed(() => !isLoading() && visiblePages().length === 0),
      areAllVisibleSelected: computed(
        () =>
          visiblePages().length > 0 &&
          visiblePages().every((page) => selectedIdSet().has(page.kind)),
      ),
    };
  }),
  withMethods((store, repository = inject(ContentPageRepository)) => ({
    loadPages: rxMethod<void>(
      pipe(
        tap(() => store.setLoading()),
        switchMap(() =>
          repository.getPages().pipe(
            tap((pages) => {
              patchState(store, { pages });
              store.setLoaded();
            }),
            catchError((error: Error) => {
              store.setError(error.message);
              return of(null);
            }),
          ),
        ),
      ),
    ),
    setSearch(search: string): void {
      patchState(store, { search });
    },
    toggleAllVisible(): void {
      if (store.areAllVisibleSelected()) {
        store.clearSelection();
        return;
      }
      store.selectAll(store.visiblePages().map((page) => page.kind));
    },
  })),
);
