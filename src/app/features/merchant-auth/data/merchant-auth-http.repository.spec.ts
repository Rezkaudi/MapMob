import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { WRONG_CREDENTIALS_MESSAGE } from '../../auth/data/auth-messages';
import { MERCHANT_ROLE } from '../../auth/models/merchant-role';
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
    request.flush({
      status_code: 200,
      data: { user: { id: 35, name: 'أحمد', email: 'a@b.com', role: 'vendor' }, token: 't' },
    });
    expect(await response).toEqual({
      id: '35',
      name: 'أحمد',
      role: MERCHANT_ROLE,
      avatarUrl: null,
      token: 't',
    });
  });

  it('shows the wrong-credentials message on a 401', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(repository.signIn({ email: 'a@b.com', password: 'bad' }));

    http
      .expectOne('https://api.test/owner/auth/login')
      .flush({ message: 'The email or password is incorrect.' }, { status: 401, statusText: 'x' });
    await expect(response).rejects.toThrow(WRONG_CREDENTIALS_MESSAGE);
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
    expect(request.request.body).toEqual({ email: 'a@b.com', otp: '123456' });
    request.flush({ data: { recovery_token: 'r-1' } });
    expect((await response).resetToken).toBe('r-1');
  });

  it('uses the code as the reset token when the server sends none back', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(
      repository.verifyResetCode({ email: 'a@b.com', code: '123456' }),
    );

    http
      .expectOne('https://api.test/owner/auth/password/verify-code')
      .flush({ status_code: 200, message: 'ok', data: null });
    expect((await response).resetToken).toBe('123456');
  });

  it('sets the new password with the reset token', async () => {
    const { repository, http } = setUp();
    const response = firstValueFrom(
      repository.resetPassword({ email: 'a@b.com', resetToken: 'r-1', password: 'new-secret-1' }),
    );

    const request = http.expectOne('https://api.test/owner/auth/password/reset');
    expect(request.request.body).toEqual({
      email: 'a@b.com',
      recovery_token: 'r-1',
      password: 'new-secret-1',
      password_confirmation: 'new-secret-1',
    });
    request.flush(null, { status: 204, statusText: 'No Content' });
    await response;
  });
});
