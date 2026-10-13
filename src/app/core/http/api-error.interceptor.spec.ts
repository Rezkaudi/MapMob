import { TestBed } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { ApiError } from './api-error';
import { apiErrorInterceptor, SERVER_UNREACHABLE_MESSAGE } from './api-error.interceptor';

const URL = 'https://api.test/admin/regions';

describe('apiErrorInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([apiErrorInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('turns a failed call into an ApiError with the server message', async () => {
    const response = firstValueFrom(httpClient.get(URL)).catch((error: unknown) => error);

    http
      .expectOne(URL)
      .flush({ message: 'لا يمكن الحذف' }, { status: 422, statusText: 'Unprocessable' });

    const error = (await response) as ApiError;
    expect(error).toBeInstanceOf(ApiError);
    expect(error.status).toBe(422);
    expect(error.message).toBe('لا يمكن الحذف');
  });

  it('gives a plain message when the server sends none', async () => {
    const response = firstValueFrom(httpClient.get(URL)).catch((error: unknown) => error);

    http.expectOne(URL).flush('<html>', { status: 500, statusText: 'Server Error' });

    expect(((await response) as ApiError).message).toBe(SERVER_UNREACHABLE_MESSAGE);
  });
});
