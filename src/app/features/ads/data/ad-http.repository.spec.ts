import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { CLOCK } from '../../../core/config/clock';
import { buildAdDraft } from '../testing/ad-fixture';
import { AdHttpRepository } from './ad-http.repository';
import { LiveAd } from './live-ad';
import { toAd, toAdDetail } from './live-ad-mapping';

const BASE_URL = 'https://api.test';
const ADS_URL = `${BASE_URL}/admin/ads`;
const TODAY = '2026-10-14';
const LIVE_AD: LiveAd = {
  id: 9,
  advertiser_type: 'store',
  store: { id: 4, name: 'متجر السعادة' },
  title: 'اعلان الشتاء',
  description: null,
  placement: 'home',
  starts_at: '2026-09-22T00:00:00.000000Z',
  ends_at: '2026-12-22T00:00:00.000000Z',
  priority: 3,
  status: 'active',
  views_count: 10,
  clicks_count: 1,
  media: [],
  created_at: '2026-09-22T19:03:07.000000Z',
  updated_at: '2026-10-13T17:11:03.000000Z',
};
const AD = toAd(LIVE_AD, TODAY);

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
        { provide: CLOCK, useValue: () => new Date(2026, 9, 14, 12) },
      ],
    });
    repository = TestBed.inject(AdHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of ads and reads the total from pagination', async () => {
    const response = firstValueFrom(
      repository.getAds({ pageIndex: 1, pageSize: 4, status: 'paused' }),
    );

    const request = http.expectOne((candidate) => candidate.url === ADS_URL);
    expect(request.request.params.get('status')).toBe('inactive');
    expect(request.request.params.get('page')).toBe('2');
    request.flush({ data: [LIVE_AD], pagination: { total: 9 } });

    expect(await response).toEqual({ items: [AD], totalCount: 9 });
  });

  it('reads the summary and one ad in detail', async () => {
    const summaryResponse = firstValueFrom(repository.getSummary());
    const detailResponse = firstValueFrom(repository.getAdDetail('9'));

    http
      .expectOne(`${ADS_URL}/summary`)
      .flush({ data: { total: 4, active: 2, upcoming: 1, expired: 1 } });
    http.expectOne(`${ADS_URL}/9`).flush({ data: LIVE_AD });

    expect(await summaryResponse).toEqual({
      totalCount: 4,
      activeCount: 2,
      scheduledCount: 1,
      endedCount: 1,
    });
    expect(await detailResponse).toEqual(toAdDetail(LIVE_AD, TODAY));
  });

  it('takes the stores for the form from the offer form options', async () => {
    const options = firstValueFrom(repository.getFormOptions());

    http
      .expectOne(`${BASE_URL}/admin/offers/formoptions`)
      .flush({ data: { stores: [{ id: 4, name: 'متجر السعادة' }] } });

    expect(await options).toEqual({ places: [{ id: '4', name: 'متجر السعادة' }] });
  });

  it('creates with a POST and updates with a POST that names PUT', async () => {
    const created = firstValueFrom(repository.createAd(buildAdDraft()));
    const updated = firstValueFrom(repository.updateAd('9', buildAdDraft()));

    const create = http.expectOne(ADS_URL);
    const update = http.expectOne(`${ADS_URL}/9`);
    expect([create.request.method, update.request.method]).toEqual(['POST', 'POST']);
    expect(create.request.body.has('_method')).toBe(false);
    expect(update.request.body.get('_method')).toBe('PUT');
    create.flush({ data: LIVE_AD });
    update.flush({ data: LIVE_AD });

    expect(await created).toEqual(AD);
    expect(await updated).toEqual(AD);
  });

  it('pauses and resumes an ad', async () => {
    const pauseResponse = firstValueFrom(repository.pauseAd('9'));
    const resumeResponse = firstValueFrom(repository.resumeAd('9'));

    const pauseRequest = http.expectOne(`${ADS_URL}/9/pause`);
    expect(pauseRequest.request.method).toBe('POST');
    pauseRequest.flush({ data: { ...LIVE_AD, status: 'inactive', media: undefined } });
    http.expectOne(`${ADS_URL}/9/resume`).flush({ data: LIVE_AD });

    expect((await pauseResponse).status).toBe('paused');
    expect(await resumeResponse).toEqual(AD);
  });

  it('deletes an ad and downloads the export without a page', async () => {
    const deleted = firstValueFrom(repository.deleteAd('9'), { defaultValue: undefined });
    const exported = firstValueFrom(
      repository.exportAds({ pageIndex: 2, pageSize: 4, search: 'حملة' }),
    );

    const remove = http.expectOne(`${ADS_URL}/9`);
    expect(remove.request.method).toBe('DELETE');
    remove.flush({ data: null });
    const download = http.expectOne((candidate) => candidate.url === `${ADS_URL}/export`);
    expect(download.request.responseType).toBe('blob');
    expect(download.request.params.get('search')).toBe('حملة');
    expect(download.request.params.has('page')).toBe(false);
    download.flush(new Blob(['csv']));

    expect(await deleted).toBeUndefined();
    expect(await exported).toBeInstanceOf(Blob);
  });
});
