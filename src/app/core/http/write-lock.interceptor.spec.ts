import { TestBed } from '@angular/core/testing';
import { HttpClient, HttpContext, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { firstValueFrom } from 'rxjs';
import { PageLock } from '../page-lock/page-lock';
import { writeLockInterceptor } from './write-lock.interceptor';
import { SKIPS_WRITE_LOCK } from './skips-write-lock';

const URL = 'https://api.test/admin/regions';

describe('writeLockInterceptor', () => {
  let httpClient: HttpClient;
  let http: HttpTestingController;
  let pageLock: PageLock;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([writeLockInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    httpClient = TestBed.inject(HttpClient);
    http = TestBed.inject(HttpTestingController);
    pageLock = TestBed.inject(PageLock);
  });

  afterEach(() => http.verify());

  it('is busy while a write runs and idle once it ends', async () => {
    const response = firstValueFrom(httpClient.post(URL, {}));

    expect(pageLock.isBusy()).toBe(true);

    http.expectOne(URL).flush({});
    await response;

    expect(pageLock.isBusy()).toBe(false);
  });

  it('is idle again after a write fails', async () => {
    const response = firstValueFrom(httpClient.delete(URL)).catch(() => null);

    http.expectOne(URL).flush(null, { status: 500, statusText: 'Server Error' });
    await response;

    expect(pageLock.isBusy()).toBe(false);
  });

  it('counts put and patch as writes', () => {
    httpClient.put(URL, {}).subscribe();
    httpClient.patch(URL, {}).subscribe();

    expect(pageLock.isBusy()).toBe(true);

    http.match(URL).forEach((request) => request.flush({}));

    expect(pageLock.isBusy()).toBe(false);
  });

  it('ignores reads', () => {
    httpClient.get(URL).subscribe();

    expect(pageLock.isBusy()).toBe(false);

    http.expectOne(URL).flush({});
  });

  it('ignores a write marked to run in the background', () => {
    const context = new HttpContext().set(SKIPS_WRITE_LOCK, true);
    httpClient.post(URL, {}, { context }).subscribe();

    expect(pageLock.isBusy()).toBe(false);

    http.expectOne(URL).flush({});
  });

  it('is idle again when the caller stops waiting', () => {
    const subscription = httpClient.post(URL, {}).subscribe();

    http.expectOne(URL);
    subscription.unsubscribe();

    expect(pageLock.isBusy()).toBe(false);
  });
});
