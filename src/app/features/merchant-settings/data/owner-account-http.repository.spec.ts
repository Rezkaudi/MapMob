import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { OwnerAccountHttpRepository } from './owner-account-http.repository';

const BASE_URL = 'https://api.test';
const OWNER_ACCOUNT = { fullName: 'محمد احمد', email: 'mmmm.mo@mapmob.com' };

describe('OwnerAccountHttpRepository', () => {
  let repository: OwnerAccountHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OwnerAccountHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(OwnerAccountHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('reads the owner account, which carries no role badge', async () => {
    const profile = firstValueFrom(repository.getProfile());

    http.expectOne({ method: 'GET', url: `${BASE_URL}/owner/account` }).flush(OWNER_ACCOUNT);

    expect(await profile).toEqual({ ...OWNER_ACCOUNT, roleName: null });
  });

  it('saves the name and email', async () => {
    const profile = firstValueFrom(repository.updateProfile(OWNER_ACCOUNT));

    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/owner/account` });
    expect(request.request.body).toEqual(OWNER_ACCOUNT);
    request.flush(OWNER_ACCOUNT);

    expect(await profile).toEqual({ ...OWNER_ACCOUNT, roleName: null });
  });

  it('changes the password', () => {
    const change = { currentPassword: 'old-pass-1', newPassword: 'new-pass-1' };
    repository.changePassword(change).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/owner/account/password` });
    expect(request.request.body).toEqual(change);
    request.flush(null);
  });
});
