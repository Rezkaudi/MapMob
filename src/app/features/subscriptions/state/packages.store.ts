import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, forkJoin, lastValueFrom, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { SubscriptionRepository } from '../data/subscription.repository';
import { PackagePlan } from '../models/package-plan';
import { PlanDraft } from '../models/plan-draft';
import { SubscriptionSummary } from '../models/subscription-summary';
import { buildSubscriptionStatCards } from './subscription-stat-cards';

interface PackagesState {
  readonly plans: readonly PackagePlan[];
  readonly summary: SubscriptionSummary | null;
  /** Keeps the empty message from flashing before the first load answers. */
  readonly hasLoaded: boolean;
}

const initialState: PackagesState = { plans: [], summary: null, hasLoaded: false };

export const PackagesStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ plans, summary, hasLoaded }) => ({
    statCards: computed(() => (summary() ? buildSubscriptionStatCards(summary()!) : [])),
    isSummaryLoading: computed(() => summary() === null),
    planCount: computed(() => plans().length),
    hasNoPlans: computed(() => hasLoaded() && plans().length === 0),
  })),
  withMethods((store, repository = inject(SubscriptionRepository)) => {
    /** Writes that answer with the saved package put it straight back in the list. */
    const runWrite = async (request: Observable<PackagePlan>): Promise<boolean> => {
      patchState(store, { isSaving: true, saveError: null });
      try {
        const saved = await lastValueFrom(request);
        patchState(store, {
          plans: store.plans().map((plan) => (plan.id === saved.id ? saved : plan)),
          isSaving: false,
        });
        return true;
      } catch (error) {
        patchState(store, { isSaving: false, saveError: (error as Error).message });
        return false;
      }
    };

    return {
      load: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            forkJoin({
              plans: repository.getPlans(),
              summary: repository.getSummary(),
            }).pipe(
              tap((result) => {
                patchState(store, { ...result, hasLoaded: true });
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

      /** Resolves `true` once the package is saved, so the dialog can close. */
      savePlan(id: string, draft: PlanDraft): Promise<boolean> {
        return runWrite(repository.updatePlan(id, draft));
      },

      setPlanActive(id: string, isActive: boolean): Promise<boolean> {
        return runWrite(repository.setPlanActive(id, isActive));
      },

      async deletePlan(id: string): Promise<boolean> {
        const removed = await store.runSave(repository.deletePlan(id));
        if (removed) {
          patchState(store, { plans: store.plans().filter((plan) => plan.id !== id) });
        }
        return removed;
      },
    };
  }),
);
