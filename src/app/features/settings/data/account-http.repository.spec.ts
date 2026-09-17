import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AccountHttpRepository } from './account-http.repository';

const BASE_URL = 'https://api.test';

describe('AccountHttpRepository', () => {
  let repository: AccountHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AccountHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(AccountHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for the account profile', () => {
    repository.getProfile().subscribe();

    http.expectOne({ method: 'GET', url: `${BASE_URL}/settings/account` }).flush({});
  });

  it('saves the name and email', () => {
    const draft = { fullName: 'خولة محمد', email: 'khawla.mo@mapmob.com' };
    repository.updateProfile(draft).subscribe();

    const request = http.expectOne({ method: 'PUT', url: `${BASE_URL}/settings/account` });
    expect(request.request.body).toEqual(draft);
    request.flush({});
  });

  it('changes the password', () => {
    const change = { currentPassword: 'old-pass-1', newPassword: 'new-pass-1' };
    repository.changePassword(change).subscribe();

    const request = http.expectOne({
      method: 'PUT',
      url: `${BASE_URL}/settings/account/password`,
    });
    expect(request.request.body).toEqual(change);
    request.flush(null);
  });
});
