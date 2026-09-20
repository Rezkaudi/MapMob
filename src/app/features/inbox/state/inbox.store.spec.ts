import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { InboxRepository } from '../data/inbox.repository';
import { InboxNotification } from '../models/inbox-notification';
import { buildInboxNotification } from '../testing/inbox-fixture';
import { InboxStore } from './inbox.store';

const UNREAD = buildInboxNotification({ id: 'a', isRead: false });
const READ = buildInboxNotification({ id: 'b', isRead: true });

function createStore(repository: Partial<InboxRepository>) {
  TestBed.configureTestingModule({
    providers: [InboxStore, { provide: InboxRepository, useValue: repository }],
  });
  return TestBed.inject(InboxStore);
}

function loadedStore(notifications: readonly InboxNotification[] = [UNREAD, READ]) {
  const store = createStore({
    getNotifications: () => of(notifications),
    markAsRead: (id) => of({ ...UNREAD, id, isRead: true }),
  });
  store.loadNotifications();
  return store;
}

describe('InboxStore', () => {
  it('opens on الكل with every notification and counts the unread ones', () => {
    const store = loadedStore();

    expect(store.tab()).toBe('all');
    expect(store.visibleNotifications()).toEqual([UNREAD, READ]);
    expect(store.unreadCount()).toBe(1);
    expect(store.isLoading()).toBe(false);
  });

  it('narrows the feed to the tab the admin picks', () => {
    const store = loadedStore();

    store.setTab('unread');
    expect(store.visibleNotifications()).toEqual([UNREAD]);

    store.setTab('read');
    expect(store.visibleNotifications()).toEqual([READ]);
  });

  it('reports an empty feed for the tab, not for the whole inbox', () => {
    const store = loadedStore([READ]);

    expect(store.hasNoNotifications()).toBe(false);

    store.setTab('unread');
    expect(store.hasNoNotifications()).toBe(true);
  });

  it('marks one as read and drops it out of the unread count', () => {
    const store = loadedStore();

    store.markAsRead('a');

    expect(store.unreadCount()).toBe(0);
    expect(store.visibleNotifications()[0].isRead).toBe(true);
  });

  it('leaves an already read notification alone', () => {
    let calls = 0;
    const store = createStore({
      getNotifications: () => of([READ]),
      markAsRead: (id) => {
        calls += 1;
        return of({ ...READ, id });
      },
    });
    store.loadNotifications();

    store.markAsRead('b');

    expect(calls).toBe(0);
  });

  it('loads once for the bell, however many pages ask', () => {
    let calls = 0;
    const store = createStore({
      getNotifications: () => {
        calls += 1;
        return of([UNREAD]);
      },
    });

    store.loadOnce();
    store.loadOnce();

    expect(calls).toBe(1);
  });

  it('keeps the failure message so the page can offer a retry', () => {
    const store = createStore({
      getNotifications: () => throwError(() => new Error('تعذر تحميل الإشعارات')),
    });

    store.loadNotifications();

    expect(store.error()).toBe('تعذر تحميل الإشعارات');
    expect(store.isLoading()).toBe(false);
  });
});
