import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { RolesRepository } from '../data/roles.repository';
import { AdminRole } from '../models/admin-role';
import { RoleDialogState } from '../models/role-dialog-state';
import { RoleDraft } from '../models/role-draft';

type RoleNotice = 'add' | 'edit' | 'delete';

interface AdminRolesState {
  readonly roles: readonly AdminRole[];
  readonly dialog: RoleDialogState | null;
  readonly pendingDeletion: AdminRole | null;
  readonly isDeleting: boolean;
  readonly savedNotice: RoleNotice | null;
}

const initialState: AdminRolesState = {
  roles: [],
  dialog: null,
  pendingDeletion: null,
  isDeleting: false,
  savedNotice: null,
};

export const AdminRolesStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ isDeleting, saveError }) => ({
    /** A refused delete closes the confirmation, so its reason floats up as a toast instead. */
    deleteError: computed(() => (isDeleting() ? saveError() : null)),
  })),
  withMethods((store, repository = inject(RolesRepository)) => {
    const replaceRole = (saved: AdminRole) =>
      patchState(store, {
        roles: store.roles().map((role) => (role.id === saved.id ? saved : role)),
      });

    return {
      loadRoles: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getRoles().pipe(
              tap((roles) => {
                patchState(store, { roles });
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
      openAddDialog(): void {
        patchState(store, { dialog: { mode: 'add' }, savedNotice: null, isDeleting: false });
      },
      openRole(role: AdminRole): void {
        const mode = role.isFullAccess ? 'view' : 'edit';
        patchState(store, { dialog: { mode, role }, savedNotice: null, isDeleting: false });
      },
      closeDialog(): void {
        patchState(store, { dialog: null });
        store.clearSaveError();
      },
      dismissSavedNotice(): void {
        patchState(store, { savedNotice: null });
      },
      async saveRole(draft: RoleDraft): Promise<boolean> {
        const dialog = store.dialog();
        if (!dialog || dialog.mode === 'view') {
          return false;
        }
        const request =
          dialog.mode === 'add'
            ? repository
                .addRole(draft)
                .pipe(tap((added) => patchState(store, { roles: [...store.roles(), added] })))
            : repository.updateRole(dialog.role.id, draft).pipe(tap(replaceRole));
        const isSaved = await store.runSave(request);
        if (isSaved) {
          patchState(store, { dialog: null, savedNotice: dialog.mode });
        }
        return isSaved;
      },
      askToDelete(role: AdminRole): void {
        patchState(store, { pendingDeletion: role, savedNotice: null });
        store.clearSaveError();
      },
      cancelDeletion(): void {
        patchState(store, { pendingDeletion: null });
      },
      async confirmDeletion(): Promise<boolean> {
        const role = store.pendingDeletion();
        if (!role) {
          return false;
        }
        patchState(store, { isDeleting: true });
        const isDeleted = await store.runSave(repository.deleteRole(role.id));
        patchState(store, { pendingDeletion: null });
        if (isDeleted) {
          patchState(store, {
            roles: store.roles().filter((candidate) => candidate.id !== role.id),
            savedNotice: 'delete',
            isDeleting: false,
          });
        }
        return isDeleted;
      },
    };
  }),
);
