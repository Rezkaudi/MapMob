import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { appConfig } from './app.config';
import { PageLock } from './core/page-lock/page-lock';

const URL = 'https://api.test/admin/regions';

describe('appConfig', () => {
  it('marks the app busy while a write request runs', () => {
    TestBed.configureTestingModule({
      providers: [...appConfig.providers, provideHttpClientTesting()],
    });
    const http = TestBed.inject(HttpTestingController);

    TestBed.inject(HttpClient).post(URL, {}).subscribe();

    expect(TestBed.inject(PageLock).isBusy()).toBe(true);
    http.expectOne(URL).flush({});
  });
});
