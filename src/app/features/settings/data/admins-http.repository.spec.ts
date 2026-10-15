import { HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { SETTINGS_URL, setUpSettingsRepository } from '../testing/settings-http-testing';
import { AdminsHttpRepository } from './admins-http.repository';

const ADMIN = {
  id: '1',
  fullName: 'map mop',
  email: 'obedah@gmail.com',
  roleId: '5',
  roleName: 'super_admin',
  status: 'active',
  lastSignInAt: '2026-10-15T08:00:00+00:00',
};
const CUSTOMER = { ...ADMIN, id: '2', email: null, roleId: '1', roleName: 'customer' };
const VENDOR = { ...ADMIN, id: '3', roleId: '2', roleName: 'vendor' };

describe('AdminsHttpRepository', () => {
  let repository: AdminsHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => ({ repository, http } = setUpSettingsRepository(AdminsHttpRepository)));

  afterEach(() => http.verify());

  it('lists the dashboard team only, as the server also sends app users and store owners', async () => {
    const response = firstValueFrom(repository.getAdmins());

    http.expectOne(`${SETTINGS_URL}/admins`).flush([ADMIN, CUSTOMER, VENDOR]);

    expect(await response).toEqual([
      {
        id: '1',
        fullName: 'map mop',
        email: 'obedah@gmail.com',
        roleId: '5',
        roleName: 'super_admin',
        status: 'active',
        lastSignInOn: '2026-10-15',
      },
    ]);
  });

  it('invites an admin', async () => {
    const invitation = { fullName: 'مشرف', email: 'admin@example.com', roleId: '3' };
    const response = firstValueFrom(repository.inviteAdmin(invitation));

    const request = http.expectOne(`${SETTINGS_URL}/admins`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual(invitation);
    request.flush({ data: { ...ADMIN, id: '30', ...invitation, lastSignInAt: null } });

    const admin = await response;
    expect([admin.id, admin.lastSignInOn]).toEqual(['30', null]);
  });
});
