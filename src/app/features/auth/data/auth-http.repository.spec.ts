import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AuthHttpRepository } from './auth-http.repository';

const BASE_URL = 'https://api.test';
const CREDENTIALS = { email: 'admin@mapmob.com', password: 'secret' };

describe('AuthHttpRepository', () => {
  let repository: AuthHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(AuthHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('signs in with the admin login and keeps the user and token', async () => {
    const response = firstValueFrom(repository.signIn(CREDENTIALS));

    const request = http.expectOne({ method: 'POST', url: `${BASE_URL}/admin/login` });
    expect(request.request.body).toEqual(CREDENTIALS);
    request.flush({
      status_code: 200,
      message: 'Login successful.',
      data: {
        user: { id: 1, name: 'Obedah', email: 'admin@mapmob.com', role: 'super_admin' },
        token: '5|abc',
      },
    });

    expect(await response).toEqual({
      id: '1',
      name: 'Obedah',
      role: 'super_admin',
      avatarUrl: null,
      token: '5|abc',
    });
  });

  it('shows the Arabic wrong-password message when the server refuses the login', async () => {
    const response = firstValueFrom(repository.signIn(CREDENTIALS)).catch((error: Error) => error);

    http
      .expectOne(`${BASE_URL}/admin/login`)
      .flush({ message: 'The email or password is incorrect.' }, { status: 401, statusText: 'No' });

    expect(((await response) as Error).message).toBe('البريد الإلكتروني أو كلمة المرور غير صحيحة');
  });

  it('revokes the token on sign-out', () => {
    repository.signOut().subscribe();

    http.expectOne({ method: 'POST', url: `${BASE_URL}/admin/logout` }).flush({});
  });
});
