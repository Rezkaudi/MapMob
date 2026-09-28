import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { OwnerNotificationsHttpRepository } from './owner-notifications-http.repository';

const BASE_URL = 'https://api.test';

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

  it("asks for the owner's notifications", () => {
    repository.getNotifications().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/owner/notifications` }).flush([]);
  });

  it('marks one notification as read with an empty body', () => {
    repository.markAsRead('owner-notification-1').subscribe();

    const request = http.expectOne({
      method: 'PATCH',
      url: `${BASE_URL}/owner/notifications/owner-notification-1/read`,
    });
    expect(request.request.body).toEqual({});
    request.flush({});
  });
});
