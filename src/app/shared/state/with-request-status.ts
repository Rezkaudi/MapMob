import { signalStoreFeature, withState, withMethods, patchState } from '@ngrx/signals';

export interface RequestStatusState {
  readonly isLoading: boolean;
  readonly error: string | null;
}

const initialRequestStatusState: RequestStatusState = {
  isLoading: false,
  error: null,
};

export function withRequestStatus() {
  return signalStoreFeature(
    withState(initialRequestStatusState),
    withMethods((store) => ({
      setLoading(): void {
        patchState(store, { isLoading: true, error: null });
      },
      setLoaded(): void {
        patchState(store, { isLoading: false });
      },
      setError(error: string): void {
        patchState(store, { isLoading: false, error });
      },
    })),
  );
}
