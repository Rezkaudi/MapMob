import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { MerchantAuthHttpRepository } from './merchant-auth-http.repository';

function setUp() {
  TestBed.configureTestingModule({
    providers: [
      MerchantAuthHttpRepository,
      provideHttpClient(),
      provideHttpClientTesting(),
      { provide: API_BASE_URL, useValue: 'https://api.test' },
    ],
  });
  return {
    repository: TestBed.inject(MerchantAuthHttpRepository),
    http: TestBed.inject(HttpTestingController),
  };
}

describe('MerchantAuthHttpRepository', () => {
  it('signs the place owner in', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(repository.signIn({ email: 'a@b.com', password: 'secret' }));

    const request = http.expectOne('https://api.test/owner/auth/login');
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ email: 'a@b.com', password: 'secret' });
    request.flush({ id: '1', name: 'أحمد', role: 'owner', avatarUrl: null, token: 't' });
    expect((await response).token).toBe('t');
  });

  it('asks for a reset code by email', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(repository.sendResetCode('a@b.com'));

    const request = http.expectOne('https://api.test/owner/auth/password/forgot');
    expect(request.request.body).toEqual({ email: 'a@b.com' });
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });

  it('trades the code for a reset token', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(
      repository.verifyResetCode({ email: 'a@b.com', code: '123456' }),
    );

    const request = http.expectOne('https://api.test/owner/auth/password/verify-code');
    expect(request.request.body).toEqual({ email: 'a@b.com', code: '123456' });
    request.flush({ resetToken: 'r-1' });
    expect((await response).resetToken).toBe('r-1');
  });

  it('sets the new password with the reset token', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(
      repository.resetPassword({ resetToken: 'r-1', password: 'new-secret-1' }),
    );

    const request = http.expectOne('https://api.test/owner/auth/password/reset');
    expect(request.request.body).toEqual({ resetToken: 'r-1', password: 'new-secret-1' });
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });
});
