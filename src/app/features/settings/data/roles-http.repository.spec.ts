import { HttpTestingController } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { SETTINGS_URL, setUpSettingsRepository } from '../testing/settings-http-testing';
import { RolesHttpRepository } from './roles-http.repository';

const ROLES_URL = 'https://api.test/admin/roles';
const DRAFT = { name: 'مشرف', description: 'وصف', isActive: true, grants: [] };

function liveRole(id: string, name: string) {
  return {
    id,
    name,
    englishName: name,
    description: '',
    icon: 'shield',
    isFullAccess: false,
    status: 'active',
    grants: [],
    adminCount: 0,
  };
}

describe('RolesHttpRepository', () => {
  let repository: RolesHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => ({ repository, http } = setUpSettingsRepository(RolesHttpRepository)));

  afterEach(() => http.verify());

  it('keeps only the role name', () => {
    expect(repository.savesRoleDetails).toBe(false);
  });

  it('lists the dashboard roles, leaving out the app user and store owner roles', async () => {
    const response = firstValueFrom(repository.getRoles());

    http
      .expectOne(`${SETTINGS_URL}/roles`)
      .flush([liveRole('1', 'customer'), liveRole('2', 'vendor'), liveRole('3', 'admin')]);

    const roles = await response;
    expect(roles.map((role) => [role.id, role.name, role.isActive])).toEqual([
      ['3', 'admin', true],
    ]);
  });

  it('adds a role by name, then reads it back with its counts', async () => {
    const response = firstValueFrom(repository.addRole(DRAFT));

    const request = http.expectOne(ROLES_URL);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ name: 'مشرف' });
    request.flush({ data: { id: 7, name: 'مشرف' } });
    http.expectOne(`${SETTINGS_URL}/roles`).flush([liveRole('7', 'مشرف')]);

    expect((await response).id).toBe('7');
  });

  it('renames a role with PUT inside the POST', async () => {
    const response = firstValueFrom(repository.updateRole('7', DRAFT));

    const request = http.expectOne(`${ROLES_URL}/7`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ _method: 'PUT', name: 'مشرف' });
    request.flush({ data: { id: 7, name: 'مشرف' } });
    http.expectOne(`${SETTINGS_URL}/roles`).flush([liveRole('7', 'مشرف')]);

    expect((await response).name).toBe('مشرف');
  });

  it('deletes a role', async () => {
    const response = firstValueFrom(repository.deleteRole('7'), { defaultValue: undefined });

    const request = http.expectOne(`${ROLES_URL}/7`);
    expect(request.request.method).toBe('DELETE');
    request.flush({ data: null });

    await response;
  });
});
