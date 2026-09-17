import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { CLOCK } from '../../../core/config/clock';
import { NotificationRepository } from '../data/notification.repository';
import { buildNotificationDetail } from '../testing/notification-fixture';
import { NotificationDetailStore } from './notification-detail.store';

const DETAIL = buildNotificationDetail();

function createStore(getNotification: NotificationRepository['getNotification']) {
  TestBed.configureTestingModule({
    providers: [
      NotificationDetailStore,
      { provide: NotificationRepository, useValue: { getNotification } },
      { provide: CLOCK, useValue: () => new Date(2026, 8, 8, 10, 0) },
    ],
  });
  return TestBed.inject(NotificationDetailStore);
}

describe('NotificationDetailStore', () => {
  it('opens a notification on its details, loads it and builds the view', () => {
    const store = createStore(() => of(DETAIL));

    store.open('notification-1');

    expect(store.isOpen()).toBe(true);
    expect(store.panel()).toBe('details');
    expect(store.detail()).toEqual(DETAIL);
    expect(store.view()?.sendDistanceLabel).toBe('متبقي يومين');
  });

  it('moves between the details, the reschedule and the resend panels, and closes', () => {
    const store = createStore(() => of(DETAIL));
    store.open('notification-1');

    store.showPanel('reschedule');
    expect(store.panel()).toBe('reschedule');
    store.showPanel('details');
    expect(store.panel()).toBe('details');

    store.close();
    expect(store.isOpen()).toBe(false);
    expect(store.detail()).toBeNull();
    expect(store.view()).toBeNull();
  });

  it('keeps the error and loads the same notification again on retry', () => {
    let calls = 0;
    const store = createStore(() => {
      calls += 1;
      return calls === 1 ? throwError(() => new Error('تعذر تحميل الإشعار')) : of(DETAIL);
    });

    store.open('notification-1');
    expect(store.error()).toBe('تعذر تحميل الإشعار');

    store.reload();
    expect(store.detail()).toEqual(DETAIL);
  });
});
