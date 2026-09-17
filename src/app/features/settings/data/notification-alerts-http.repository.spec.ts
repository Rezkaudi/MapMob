import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { NotificationAlertsHttpRepository } from './notification-alerts-http.repository';

const BASE_URL = 'https://api.test';

describe('NotificationAlertsHttpRepository', () => {
  let repository: NotificationAlertsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        NotificationAlertsHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(NotificationAlertsHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the admin alerts', () => {
    repository.getAlerts().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/settings/notifications` }).flush([]);
  });

  it('turns one alert on or off', () => {
    repository.setAlertEnabled('review-reported', false).subscribe();

    const request = http.expectOne({
      method: 'PUT',
      url: `${BASE_URL}/settings/notifications/review-reported`,
    });
    expect(request.request.body).toEqual({ isEnabled: false });
    request.flush({ kind: 'review-reported', isEnabled: false });
  });
});
