import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { OwnerNotificationsHttpRepository } from './owner-notifications-http.repository';

const BASE_URL = 'https://api.test';
const NOTIFICATIONS_URL = `${BASE_URL}/owner/notifications`;

describe('OwnerNotificationsHttpRepository', () => {
  let repository: OwnerNotificationsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OwnerNotificationsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(OwnerNotificationsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it("reads every page of the owner's notifications", async () => {
    const response = firstValueFrom(repository.getNotifications());

    http
      .expectOne((one) => one.url === NOTIFICATIONS_URL)
      .flush({
        status_code: 200,
        data: [
          {
            id: 'a1',
            type: 'App\\Notifications\\SubscriptionExpiring',
            data: { title: 'باقتك تنتهي قريباً', body: 'بقي 3 أيام', category: 'subscriptions' },
            read_at: null,
            created_at: '2026-10-28T09:00:00Z',
          },
          {
            id: 'a2',
            title: 'تقييم جديد',
            message: '5 نجوم',
            type: 'review',
            readAt: '2026-10-28T10:00:00Z',
            createdAt: '2026-10-28T08:00:00Z',
            data: { review_id: 7 },
          },
        ],
        unreadCount: 1,
        meta: { current_page: 1, last_page: 1 },
      });

    expect(await response).toEqual([
      {
        id: 'a1',
        category: 'subscriptions',
        title: 'باقتك تنتهي قريباً',
        body: 'بقي 3 أيام',
        receivedAt: '2026-10-28T09:00:00Z',
        isRead: false,
        subjectId: null,
      },
      {
        id: 'a2',
        category: 'reviews',
        title: 'تقييم جديد',
        body: '5 نجوم',
        receivedAt: '2026-10-28T08:00:00Z',
        isRead: true,
        subjectId: '7',
      },
    ]);
  });

  it('marks one notification as read with an empty body and reads back the row', async () => {
    const response = firstValueFrom(repository.markAsRead('a1'));

    const request = http.expectOne(`${NOTIFICATIONS_URL}/a1/read`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({});
    request.flush({
      data: {
        id: 'a1',
        data: { title: 'x', body: 'y' },
        read_at: '2026-10-29T08:00:00Z',
        created_at: '2026-10-28T09:00:00Z',
      },
    });

    expect((await response).isRead).toBe(true);
  });
});
