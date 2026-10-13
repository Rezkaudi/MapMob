import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { Router } from '@angular/router';
import { vi } from 'vitest';
import { ADMIN_LOGIN_URL } from '../models/login-role';
import { AuthStore } from '../state/auth.store';
import { sessionExpiryInterceptor } from './session-expiry.interceptor';

const URL = 'https://api.test/admin/regions';
const UNAUTHORIZED = { status: 401, statusText: 'Unauthorized' };

describe('sessionExpiryInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  const signOut = vi.fn();
  const navigateByUrl = vi.fn();

  beforeEach(() => {
    signOut.mockReset();
    navigateByUrl.mockReset();
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([sessionExpiryInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthStore, useValue: { signOut } },
        { provide: Router, useValue: { navigateByUrl } },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('signs out and opens the login page when the saved token is refused', () => {
    httpClient
      .get(URL, { headers: { Authorization: 'Bearer old' } })
      .subscribe({ error: () => {} });

    http.expectOne(URL).flush({ message: 'Unauthenticated.' }, UNAUTHORIZED);

    expect(signOut).toHaveBeenCalled();
    expect(navigateByUrl).toHaveBeenCalledWith(ADMIN_LOGIN_URL);
  });

  it('keeps the session when a call without a token is refused, like a wrong password', () => {
    httpClient.post(URL, {}).subscribe({ error: () => {} });

    http.expectOne(URL).flush({ message: 'wrong' }, UNAUTHORIZED);

    expect(signOut).not.toHaveBeenCalled();
  });
});
