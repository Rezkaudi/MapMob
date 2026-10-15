import { HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { SETTINGS_URL, setUpSettingsRepository } from '../testing/settings-http-testing';
import { NotificationAlertsHttpRepository } from './notification-alerts-http.repository';

describe('NotificationAlertsHttpRepository', () => {
  let repository: NotificationAlertsHttpRepository;
  let http: HttpTestingController;

  beforeEach(
    () => ({ repository, http } = setUpSettingsRepository(NotificationAlertsHttpRepository)),
  );

  afterEach(() => http.verify());

  it('reads the alerts', async () => {
    const alerts = [{ kind: 'new-complaint', isEnabled: true }];
    const response = firstValueFrom(repository.getAlerts());

    http.expectOne(`${SETTINGS_URL}/notifications`).flush(alerts);

    expect(await response).toEqual(alerts);
  });

  it('switches one alert and answers with its new state, as the server answers only true', async () => {
    const response = firstValueFrom(repository.setAlertEnabled('review-reported', true));

    const request = http.expectOne(`${SETTINGS_URL}/notifications/review-reported`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual({ isEnabled: true });
    request.flush({ status: true });

    expect(await response).toEqual({ kind: 'review-reported', isEnabled: true });
  });
});
