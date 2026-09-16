import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildAd, buildAdDetail, buildAdDraft } from '../testing/ad-fixture';
import { AdHttpRepository } from './ad-http.repository';

const BASE_URL = 'https://api.test';

describe('AdHttpRepository', () => {
  let repository: AdHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AdHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(AdHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of ads with the filters, and the summary', async () => {
    const page = { items: [buildAd()], totalCount: 1 };
    const summary = { totalCount: 34, activeCount: 16, scheduledCount: 14, endedCount: 4 };
    const pageResponse = firstValueFrom(
      repository.getAds({ pageIndex: 0, pageSize: 4, contentType: 'video' }),
    );
    const summaryResponse = firstValueFrom(repository.getSummary());

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/ads`);
    expect(request.request.params.get('contentType')).toBe('video');
    request.flush(page);
    http.expectOne(`${BASE_URL}/ads/summary`).flush(summary);

    expect(await pageResponse).toEqual(page);
    expect(await summaryResponse).toEqual(summary);
  });

  it('deletes an ad and downloads the export as a file', async () => {
    const deleted = firstValueFrom(repository.deleteAd('ad-4'), { defaultValue: undefined });
    const exported = firstValueFrom(
      repository.exportAds({ pageIndex: 0, pageSize: 4, search: 'حملة' }),
    );

    const remove = http.expectOne(`${BASE_URL}/ads/ad-4`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush(null);
    const download = http.expectOne((candidate) => candidate.url === `${BASE_URL}/ads/export`);
    expect(download.request.responseType).toBe('blob');
    download.flush(new Blob(['csv']));

    expect(await deleted).toBeNull();
    expect(await exported).toBeInstanceOf(Blob);
  });

  it('reads the form options and one ad, and saves with a POST or a PUT of form data', async () => {
    const options = firstValueFrom(repository.getFormOptions());
    const detail = firstValueFrom(repository.getAdDetail('ad-2'));
    const created = firstValueFrom(repository.createAd(buildAdDraft()));
    const updated = firstValueFrom(repository.updateAd('ad-2', buildAdDraft()));

    http.expectOne(`${BASE_URL}/ads/form-options`).flush({ places: [] });
    http
      .expectOne(
        (candidate) => candidate.method === 'GET' && candidate.url === `${BASE_URL}/ads/ad-2`,
      )
      .flush(buildAdDetail());
    const create = http.expectOne((candidate) => candidate.method === 'POST');
    const update = http.expectOne((candidate) => candidate.method === 'PUT');
    expect([create.request.url, update.request.url]).toEqual([
      `${BASE_URL}/ads`,
      `${BASE_URL}/ads/ad-2`,
    ]);
    expect(create.request.body).toBeInstanceOf(FormData);
    create.flush(buildAd());
    update.flush(buildAd({ id: 'ad-2' }));

    expect(await options).toEqual({ places: [] });
    expect((await detail).placeId).toBe('place-3');
    expect((await created).id).toBe('ad-1');
    expect((await updated).id).toBe('ad-2');
  });
});
