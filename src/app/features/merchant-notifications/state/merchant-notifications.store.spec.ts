import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { OwnerNotificationsRepository } from '../data/owner-notifications.repository';
import { buildOwnerNotification } from '../testing/owner-notification-fixture';
import { MerchantNotificationsStore } from './merchant-notifications.store';

const UNREAD = buildOwnerNotification({ id: 'a' });
const READ_REVIEW = buildOwnerNotification({ id: 'b', category: 'reviews', isRead: true });

function loadedStore() {
  TestBed.configureTestingModule({
    providers: [
      {
        provide: OwnerNotificationsRepository,
        useValue: {
          getNotifications: () => of([UNREAD, READ_REVIEW]),
          markAsRead: (id: string) => of({ ...UNREAD, id, isRead: true }),
        },
      },
    ],
  });
  const store = TestBed.inject(MerchantNotificationsStore);
  store.loadNotifications();
  return store;
}

describe('MerchantNotificationsStore', () => {
  it('counts the unread notifications for the tab and the bell', () => {
    expect(loadedStore().unreadCount()).toBe(1);
  });

  it('words the visible notifications as merchant cards, each with its link', () => {
    const store = loadedStore();

    expect(store.visibleCards().map((card) => [card.categoryLabel, card.action?.route])).toEqual([
      ['الاشتراكات', '/merchant/subscription'],
      ['التقييمات', '/merchant/reviews'],
    ]);

    store.setTab('read');
    expect(store.visibleCards().map((card) => card.id)).toEqual(['b']);
  });

  it('marks a notification read', () => {
    const store = loadedStore();

    store.markAsRead('a');

    expect(store.unreadCount()).toBe(0);
  });
});
