import { HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { SETTINGS_URL, setUpSettingsRepository } from '../testing/settings-http-testing';
import { AccountHttpRepository } from './account-http.repository';

const PROFILE = { fullName: 'map mop', email: 'obedah@gmail.com', roleName: 'super_admin' };

describe('AccountHttpRepository', () => {
  let repository: AccountHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => ({ repository, http } = setUpSettingsRepository(AccountHttpRepository)));

  afterEach(() => http.verify());

  it('reads the signed-in admin', async () => {
    const response = firstValueFrom(repository.getProfile());

    http.expectOne(`${SETTINGS_URL}/account`).flush({ data: PROFILE });

    expect(await response).toEqual(PROFILE);
  });

  it('saves the name and email', async () => {
    const response = firstValueFrom(
      repository.updateProfile({ fullName: 'map mop', email: 'obedah@gmail.com' }),
    );

    const request = http.expectOne(`${SETTINGS_URL}/account`);
    expect(request.request.method).toBe('PUT');
    request.flush({ data: PROFILE });

    expect(await response).toEqual(PROFILE);
  });

  it('changes the password', async () => {
    const change = { currentPassword: 'old-password', newPassword: 'new-password' };
    const response = firstValueFrom(repository.changePassword(change), {
      defaultValue: undefined,
    });

    const request = http.expectOne(`${SETTINGS_URL}/account/password`);
    expect(request.request.method).toBe('PUT');
    expect(request.request.body).toEqual(change);
    request.flush({ message: 'Password updated successfully' });

    await response;
  });
});
