import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { AuthStorage } from './auth-storage';
import { authTokenInterceptor } from './auth-token.interceptor';

const BASE_URL = 'https://api.test';

describe('authTokenInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  let savedToken: string | null;

  beforeEach(() => {
    savedToken = '7|secret';
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authTokenInterceptor])),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
        {
          provide: AuthStorage,
          useValue: { read: () => (savedToken ? { token: savedToken } : null) },
        },
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('sends the saved token, JSON and Arabic to the backend', () => {
    httpClient.get(`${BASE_URL}/admin/regions`).subscribe();

    const request = http.expectOne(`${BASE_URL}/admin/regions`);
    expect(request.request.headers.get('Authorization')).toBe('Bearer 7|secret');
    expect(request.request.headers.get('Accept')).toBe('application/json');
    expect(request.request.headers.get('Accept-Language')).toBe('ar');
    request.flush({});
  });

  it('sends no token before sign-in', () => {
    savedToken = null;
    httpClient.post(`${BASE_URL}/admin/login`, {}).subscribe();

    const request = http.expectOne(`${BASE_URL}/admin/login`);
    expect(request.request.headers.has('Authorization')).toBe(false);
    expect(request.request.headers.get('Accept')).toBe('application/json');
    request.flush({});
  });

  it('leaves calls to other hosts alone', () => {
    httpClient.get('https://tiles.example.com/1/2/3.png').subscribe();

    const request = http.expectOne('https://tiles.example.com/1/2/3.png');
    expect(request.request.headers.has('Authorization')).toBe(false);
    request.flush({});
  });
});
