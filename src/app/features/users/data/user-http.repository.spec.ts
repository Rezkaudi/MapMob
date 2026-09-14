import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildUser, buildUserDetail } from '../testing/user-fixture';
import { UserHttpRepository } from './user-http.repository';

const BASE_URL = 'https://api.test';
const AHMAD = buildUser();

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

  it('asks for a page of users with the filters', async () => {
    const page = { items: [AHMAD], totalCount: 1 };
    const response = firstValueFrom(
      repository.getUsers({ pageIndex: 0, pageSize: 6, status: 'active' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/users`);
    expect(request.request.params.get('status')).toBe('active');
    request.flush(page);
    expect(await response).toEqual(page);
  });

  it('reads the summary and one user in detail', async () => {
    const summary = {
      totalUserCount: 3,
      activeUserCount: 2,
      suspendedUserCount: 1,
      newUserCount: 1,
    };
    const detail = buildUserDetail();
    const summaryResponse = firstValueFrom(repository.getSummary());
    const detailResponse = firstValueFrom(repository.getUserDetail('user-1'));

    http.expectOne(`${BASE_URL}/users/summary`).flush(summary);
    http.expectOne(`${BASE_URL}/users/user-1`).flush(detail);

    expect(await summaryResponse).toEqual(summary);
    expect(await detailResponse).toEqual(detail);
  });

  it('changes the status with a PATCH and deletes with a DELETE', async () => {
    const statusResponse = firstValueFrom(repository.setUserStatus('user-1', 'suspended'));
    const deleteResponse = firstValueFrom(repository.deleteUser('user-1'), {
      defaultValue: undefined,
    });

    const patch = http.expectOne(`${BASE_URL}/users/user-1/status`);
    expect(patch.request.method).toBe('PATCH');
    expect(patch.request.body).toEqual({ status: 'suspended' });
    patch.flush(buildUser({ status: 'suspended' }));
    const remove = http.expectOne(`${BASE_URL}/users/user-1`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush(null);

    expect((await statusResponse).status).toBe('suspended');
    await deleteResponse;
  });

  it('downloads the export as a file with the same filters', async () => {
    const file = new Blob(['csv'], { type: 'text/csv' });
    const response = firstValueFrom(
      repository.exportUsers({ pageIndex: 0, pageSize: 6, accountType: 'registered' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/users/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('accountType')).toBe('registered');
    request.flush(file);
    expect(await response).toBe(file);
  });
});
