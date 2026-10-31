import { provideHttpClient } from '@angular/common/http';
import { HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { readAllOwnerPages } from './read-all-owner-pages';

const URL = 'https://api.test/owner/things';

describe('readAllOwnerPages', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting()],
    });
  });

  it('asks for 50 rows a page, the most the server allows, and reads on to the last page', async () => {
    const http = TestBed.inject(HttpTestingController);
    const rows = firstValueFrom(readAllOwnerPages<number>(TestBed.inject(HttpClient), URL));

    const first = http.expectOne((one) => one.url === URL && one.params.get('page') === '1');
    expect(first.request.params.get('per_page')).toBe('50');
    first.flush({ data: [1], meta: { current_page: 1, last_page: 2 } });
    http
      .expectOne((one) => one.params.get('page') === '2')
      .flush({ data: [2], meta: { current_page: 2, last_page: 2 } });

    expect(await rows).toEqual([1, 2]);
  });

  it('also follows the camelCase page info some lists send', async () => {
    const http = TestBed.inject(HttpTestingController);
    const rows = firstValueFrom(readAllOwnerPages<number>(TestBed.inject(HttpClient), URL));

    http
      .expectOne((one) => one.params.get('page') === '1')
      .flush({ data: [1], meta: { currentPage: 1, lastPage: 2 } });
    http
      .expectOne((one) => one.params.get('page') === '2')
      .flush({ data: [2], meta: { currentPage: 2, lastPage: 2 } });

    expect(await rows).toEqual([1, 2]);
  });
});
