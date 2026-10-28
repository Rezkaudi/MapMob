import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { LiveUser } from './live-user';
import { toAppUser, toUserDetail } from './live-user-mapping';
import { UserHttpRepository } from './user-http.repository';

const BASE_URL = 'https://api.test';
const USERS_URL = `${BASE_URL}/admin/users`;
const LIVE_USER: LiveUser = {
  id: 5,
  name: 'obedah',
  email: null,
  phone: '963936318327',
  status: 'suspended',
  'SELECTED LOCATION': 'محافظة دمشق',
  lastActiveAt: null,
  created_at: '2026-09-25T17:55:30.000000Z',
};

describe('UserHttpRepository', () => {
  let repository: UserHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UserHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(UserHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of app users and turns the rows into users', async () => {
    const response = firstValueFrom(
      repository.getUsers({ pageIndex: 1, pageSize: 6, status: 'suspended' }),
    );

    const request = http.expectOne((candidate) => candidate.url === USERS_URL);
    expect(request.request.params.get('role')).toBe('customer');
    expect(request.request.params.get('status')).toBe('suspended');
    expect(request.request.params.get('page')).toBe('2');
    request.flush({ data: [LIVE_USER], meta: { totalCount: 7 } });

    expect(await response).toEqual({ items: [toAppUser(LIVE_USER)], totalCount: 7 });
  });

  it('answers an empty page for visitors without a call, since the server keeps none', async () => {
    const page = await firstValueFrom(
      repository.getUsers({ pageIndex: 0, pageSize: 6, accountType: 'visitor' }),
    );

    expect(page).toEqual({ items: [], totalCount: 0 });
  });

  it('reads the summary from the server summary route', async () => {
    const response = firstValueFrom(repository.getSummary());
    const summary = {
      totalUserCount: 13,
      activeUserCount: 12,
      suspendedUserCount: 1,
      newUserCount: 4,
    };

    http.expectOne(`${USERS_URL}/summary`).flush({ data: summary });

    expect(await response).toEqual(summary);
  });

  it('reads one user in detail', async () => {
    const response = firstValueFrom(repository.getUserDetail('5'));

    http.expectOne(`${USERS_URL}/5`).flush({ data: LIVE_USER });

    expect(await response).toEqual(toUserDetail(LIVE_USER));
  });

  it('changes the status with a PATCH and deletes with a DELETE', async () => {
    const statusResponse = firstValueFrom(repository.setUserStatus('5', 'active'));
    const deleteResponse = firstValueFrom(repository.deleteUser('5'), {
      defaultValue: undefined,
    });

    const patch = http.expectOne(`${USERS_URL}/5/status`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ status: 'active' });
    patch.flush({ data: { ...LIVE_USER, status: 'active' } });
    const remove = http.expectOne(`${USERS_URL}/5`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush({ data: null });

    expect((await statusResponse).status).toBe('active');
    expect(await deleteResponse).toBeUndefined();
  });

  it('downloads the export as a file with the same filters and no page', async () => {
    const file = new Blob(['csv'], { type: 'text/csv' });
    const response = firstValueFrom(
      repository.exportUsers({ pageIndex: 3, pageSize: 6, status: 'active' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${USERS_URL}/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('status')).toBe('active');
    expect(request.request.params.has('page')).toBe(false);
    request.flush(file);
    expect(await response).toBe(file);
  });
});
