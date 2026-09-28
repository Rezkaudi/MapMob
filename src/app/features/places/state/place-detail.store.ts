import { inject } from '@angular/core';
import { signalStore, withState, withMethods, patchState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, pipe, switchMap, tap, catchError, of } from 'rxjs';
import { ActivationStatus } from '../../../shared/models/activation-status';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { PlaceRepository } from '../data/place.repository';
import { PlaceDetail } from '../models/place-detail';
import { PlaceProduct } from '../models/place-product';
import { ProductDraft } from '../../../shared/models/product-draft';

interface PlaceDetailState {
  readonly place: PlaceDetail | null;
}

const initialState: PlaceDetailState = { place: null };

export const PlaceDetailStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withMethods((store, repository = inject(PlaceRepository)) => ({
    loadPlace: rxMethod<string>(
      pipe(
        tap(() => store.setLoading()),
        switchMap((id) =>
          repository.getPlace(id).pipe(
            tap((place) => {
              patchState(store, { place });
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
  })),
  withMethods((store, repository = inject(PlaceRepository)) => {
    const save = async (request: Observable<unknown>, id: string, isReloaded: boolean) => {
      const isSaved = await store.runSave(request);
      if (isSaved && isReloaded) {
        store.loadPlace(id);
      }
      return isSaved;
    };

    return {
      changeStatus(id: string, status: ActivationStatus): Promise<boolean> {
        return save(repository.setPlacesStatus([id], status), id, true);
      },
      /** The page leaves for the list once this resolves, so there is nothing to reload. */
      deletePlace(id: string): Promise<boolean> {
        return save(repository.deletePlaces([id]), id, false);
      },
    };
  }),
  /**
   * Products are changed on the page itself. There is no product endpoint yet, so these
   * edits live in the loaded place until one exists.
   */
  withMethods((store) => {
    const withProducts = (
      change: (products: readonly PlaceProduct[]) => readonly PlaceProduct[],
    ): void => {
      const place = store.place();
      if (!place) {
        return;
      }
      patchState(store, { place: { ...place, products: change(place.products) } });
    };

    return {
      addProduct(draft: ProductDraft): void {
        withProducts((products) => [...products, { ...draft, id: crypto.randomUUID() }]);
      },
      saveProduct(id: string, draft: ProductDraft): void {
        withProducts((products) =>
          products.map((product) => (product.id === id ? { ...product, ...draft } : product)),
        );
      },
      toggleProductAvailability(id: string): void {
        withProducts((products) =>
          products.map((product) =>
            product.id === id ? { ...product, isAvailable: !product.isAvailable } : product,
          ),
        );
      },
      removeProduct(id: string): void {
        withProducts((products) => products.filter((product) => product.id !== id));
      },
    };
  }),
);
