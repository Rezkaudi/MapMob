import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { catchError, forkJoin, of, pipe, switchMap, tap } from 'rxjs';
import { withRequestStatus } from '../../../shared/state/with-request-status';
import { withSaveStatus } from '../../../shared/state/with-save-status';
import { AdminsRepository } from '../data/admins.repository';
import { RolesRepository } from '../data/roles.repository';
import { AdminInvitation } from '../models/admin-invitation';
import { AdminRole } from '../models/admin-role';
import { DashboardAdmin } from '../models/dashboard-admin';

interface DashboardAdminsState {
  readonly admins: readonly DashboardAdmin[];
  readonly roles: readonly AdminRole[];
  readonly isInviteDialogOpen: boolean;
  readonly hasInvited: boolean;
}

const initialState: DashboardAdminsState = {
  admins: [],
  roles: [],
  isInviteDialogOpen: false,
  hasInvited: false,
};

export const DashboardAdminsStore = signalStore(
  withState(initialState),
  withRequestStatus(),
  withSaveStatus(),
  withComputed(({ roles }) => {
    const assignableRoles = computed(() => roles().filter((role) => role.isActive));
    return {
      assignableRoles,
      suggestedRoleId: computed(() => {
        const candidates = assignableRoles();
        return (candidates.find((role) => !role.isFullAccess) ?? candidates[0])?.id ?? null;
      }),
    };
  }),
  withMethods(
    (
      store,
      adminsRepository = inject(AdminsRepository),
      rolesRepository = inject(RolesRepository),
    ) => ({
      loadAdmins: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            forkJoin({
              admins: adminsRepository.getAdmins(),
              roles: rolesRepository.getRoles(),
            }).pipe(
              tap(({ admins, roles }) => {
                patchState(store, { admins, roles });
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
      openInviteDialog(): void {
        patchState(store, { isInviteDialogOpen: true, hasInvited: false });
      },
      closeInviteDialog(): void {
        patchState(store, { isInviteDialogOpen: false });
        store.clearSaveError();
      },
      dismissInvitedNotice(): void {
        patchState(store, { hasInvited: false });
      },
      async inviteAdmin(invitation: AdminInvitation): Promise<boolean> {
        const request = adminsRepository
          .inviteAdmin(invitation)
          .pipe(tap((admin) => patchState(store, { admins: [...store.admins(), admin] })));
        const isInvited = await store.runSave(request);
        if (isInvited) {
          patchState(store, { isInviteDialogOpen: false, hasInvited: true });
        }
        return isInvited;
      },
    }),
  ),
);
