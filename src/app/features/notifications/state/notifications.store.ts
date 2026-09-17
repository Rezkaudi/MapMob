import { computed, inject } from '@angular/core';
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { Observable, catchError, of, pipe, switchMap, tap } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { ListSort } from '../../../shared/models/list-sort';
import { resolveDatePeriodRange } from '../../../shared/state/date-period-range';
import { withListTable } from '../../../shared/state/with-list-table';
import { NotificationRepository } from '../data/notification.repository';
import { AppNotification } from '../models/notification';
import { NO_NOTIFICATION_FILTERS, NotificationFilters } from '../models/notification-filters';
import { NotificationQuery } from '../models/notification-query';
import { NotificationSummary } from '../models/notification-summary';
import { countActiveNotificationFilters } from './count-active-notification-filters';
import { buildNotificationRow } from './notification-row';
import { buildNotificationStatCards } from './notification-stat-cards';

/** The notifications design draws four rows per page. */
export const NOTIFICATIONS_PAGE_SIZE = 4;

const NO_NOTIFICATIONS_MESSAGE = 'لا توجد إشعارات مضافة حتى الآن';
const NO_MATCHES_MESSAGE = 'لا توجد نتائج مطابقة للبحث أو الفلاتر';

interface NotificationsState {
  readonly filters: NotificationFilters;
  readonly summary: NotificationSummary | null;
  readonly hasSummaryFailed: boolean;
}

const initialState: NotificationsState = {
  filters: NO_NOTIFICATION_FILTERS,
  summary: null,
  hasSummaryFailed: false,
};

export const NotificationsStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withListTable<AppNotification>({ pageSize: NOTIFICATIONS_PAGE_SIZE }),
  withComputed(({ entries, filters, search, summary, hasSummaryFailed, hasNoEntries }) => {
    const activeFilterCount = computed(() => countActiveNotificationFilters(filters()));
    return {
      activeFilterCount,
      rows: computed(() => entries().map(buildNotificationRow)),
      statCards: computed(() => buildNotificationStatCards(summary())),
      isSummaryLoading: computed(() => summary() === null && !hasSummaryFailed()),
      /** Nothing sent or saved at all: the page swaps everything below its title for the message. */
      hasNoNotifications: computed(() => hasNoEntries() && activeFilterCount() === 0),
      emptyMessage: computed(() =>
        search().trim() || activeFilterCount() > 0 ? NO_MATCHES_MESSAGE : NO_NOTIFICATIONS_MESSAGE,
      ),
    };
  }),
  withMethods((store, repository = inject(NotificationRepository), clock = inject(CLOCK)) => {
    const currentNotificationQuery = (): NotificationQuery => {
      const { audience, kind, status, sendPeriod, customRange } = store.filters();
      const { from, to } = resolveDatePeriodRange(sendPeriod, customRange, clock());
      return {
        ...store.currentQuery(),
        ...(audience ? { audience } : {}),
        ...(kind ? { kind } : {}),
        ...(status ? { status } : {}),
        ...(from ? { sentFrom: from } : {}),
        ...(to ? { sentTo: to } : {}),
      };
    };

    return {
      loadNotifications: rxMethod<void>(
        pipe(
          tap(() => store.setLoading()),
          switchMap(() =>
            repository.getNotifications(currentNotificationQuery()).pipe(
              tap((page) => store.showPage(page)),
              catchError((error: Error) => {
                store.setError(error.message);
                return of(null);
              }),
            ),
          ),
        ),
      ),
      loadSummary: rxMethod<void>(
        pipe(
          switchMap(() =>
            repository.getSummary().pipe(
              tap((summary) => patchState(store, { summary, hasSummaryFailed: false })),
              catchError(() => {
                patchState(store, { hasSummaryFailed: true });
                return of(null);
              }),
            ),
          ),
        ),
      ),
    };
  }),
  withMethods((store, repository = inject(NotificationRepository)) => {
    const reloadAll = () => {
      store.loadNotifications();
      store.loadSummary();
    };
    const saveThenReload = (request: Observable<unknown>, onSaved?: () => void) =>
      store.saveThenRefresh(request, reloadAll, onSaved);

    return {
      setSearch(search: string): void {
        store.applyQuery({ search });
        store.loadNotifications();
      },
      setSort(sort: ListSort | null): void {
        store.applyQuery({ sort });
        store.loadNotifications();
      },
      applyFilters(filters: NotificationFilters): void {
        patchState(store, { filters });
        store.resetToFirstPage();
        store.loadNotifications();
      },
      changePage(pageIndex: number): void {
        store.goToPage(pageIndex);
        store.clearSelection();
        store.loadNotifications();
      },
      deleteNotification(id: string): Promise<boolean> {
        return saveThenReload(repository.deleteNotification(id), () =>
          store.forgetRemovedEntry(id),
        );
      },
      duplicateNotification(id: string): Promise<boolean> {
        return saveThenReload(repository.duplicateNotification(id));
      },
      rescheduleNotification(id: string, sendAt: string): Promise<boolean> {
        return saveThenReload(repository.rescheduleNotification(id, sendAt));
      },
      resendNotification(id: string, sendAt: string | null): Promise<boolean> {
        return saveThenReload(repository.resendNotification(id, sendAt));
      },
    };
  }),
);
