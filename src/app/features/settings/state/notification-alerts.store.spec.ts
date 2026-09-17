import { TestBed } from '@angular/core/testing';
import { Subject, of, throwError } from 'rxjs';
import { NotificationAlertsRepository } from '../data/notification-alerts.repository';
import { NotificationAlert } from '../models/notification-alert';
import { buildNotificationAlerts } from '../testing/settings-fixture';
import { NotificationAlertsStore } from './notification-alerts.store';

function createStore(overrides: Partial<NotificationAlertsRepository> = {}) {
  const repository: Partial<NotificationAlertsRepository> = {
    getAlerts: () => of(buildNotificationAlerts()),
    setAlertEnabled: (kind, isEnabled) => of({ kind, isEnabled }),
    ...overrides,
  };
  TestBed.configureTestingModule({
    providers: [
      NotificationAlertsStore,
      { provide: NotificationAlertsRepository, useValue: repository },
    ],
  });
  const store = TestBed.inject(NotificationAlertsStore);
  store.loadAlerts();
  return store;
}

const enabledFlags = (alerts: readonly NotificationAlert[]) =>
  alerts.map((alert) => alert.isEnabled);

describe('NotificationAlertsStore', () => {
  it('loads the alerts', () => {
    expect(createStore().alerts()).toEqual(buildNotificationAlerts());
  });

  it('reports a failed load', () => {
    const store = createStore({ getAlerts: () => throwError(() => new Error('تعذر التحميل')) });

    expect(store.error()).toBe('تعذر التحميل');
  });

  it('flips the switch at once, before the server answers', () => {
    const answer = new Subject<NotificationAlert>();
    const store = createStore({ setAlertEnabled: () => answer });

    void store.setAlertEnabled('new-payment', true);

    expect(enabledFlags(store.alerts())).toEqual([true, true, true, true, true]);
  });

  it('puts the switch back and keeps the error when the save fails', async () => {
    const store = createStore({
      setAlertEnabled: () => throwError(() => new Error('تعذر حفظ التنبيه')),
    });

    expect(await store.setAlertEnabled('new-complaint', false)).toBe(false);

    expect(enabledFlags(store.alerts())).toEqual([true, true, true, true, false]);
    expect(store.saveError()).toBe('تعذر حفظ التنبيه');
  });
});
