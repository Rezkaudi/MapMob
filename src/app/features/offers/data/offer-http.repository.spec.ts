import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { buildOffer, buildOfferDetail, buildOfferDraft } from '../testing/offer-fixture';
import { OfferHttpRepository } from './offer-http.repository';

const BASE_URL = 'https://api.test';

describe('OfferHttpRepository', () => {
  let repository: OfferHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        OfferHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(OfferHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of offers with the filters', async () => {
    const page = { items: [buildOffer()], totalCount: 1 };
    const response = firstValueFrom(
      repository.getOffers({ pageIndex: 0, pageSize: 4, status: 'expired' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/offers`);
    expect(request.request.params.get('status')).toBe('expired');
    request.flush(page);
    expect(await response).toEqual(page);
  });

  it('reads the summary and one offer in detail', async () => {
    const summary = { totalCount: 34, activeCount: 16, scheduledCount: 14, endedCount: 4 };
    const detail = buildOfferDetail();
    const summaryResponse = firstValueFrom(repository.getSummary());
    const detailResponse = firstValueFrom(repository.getOfferDetail('offer-2'));

    http.expectOne(`${BASE_URL}/offers/summary`).flush(summary);
    http.expectOne(`${BASE_URL}/offers/offer-2`).flush(detail);

    expect(await summaryResponse).toEqual(summary);
    expect(await detailResponse).toEqual(detail);
  });

  it('pauses and resumes an offer with a POST each, and deletes one', async () => {
    const paused = firstValueFrom(repository.pauseOffer('offer-2'));
    const resumed = firstValueFrom(repository.resumeOffer('offer-3'));
    const deleted = firstValueFrom(repository.deleteOffer('offer-4'), { defaultValue: undefined });

    const pause = http.expectOne(`${BASE_URL}/offers/offer-2/pause`);
    const resume = http.expectOne(`${BASE_URL}/offers/offer-3/resume`);
    const remove = http.expectOne(`${BASE_URL}/offers/offer-4`);
    expect([pause.request.method, resume.request.method, remove.request.method]).toEqual([
      'POST',
      'POST',
      'DELETE',
    ]);
    pause.flush(buildOffer({ status: 'paused' }));
    resume.flush(buildOffer());
    remove.flush(null);

    expect((await paused).status).toBe('paused');
    expect((await resumed).status).toBe('active');
    expect(await deleted).toBeNull();
  });

  it('downloads the export as a file with the same filters', async () => {
    const response = firstValueFrom(
      repository.exportOffers({ pageIndex: 0, pageSize: 4, search: 'خصم' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/offers/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('search')).toBe('خصم');
    request.flush(new Blob(['csv']));
    expect(await response).toBeInstanceOf(Blob);
  });

  it('reads the form options and the items of a store', async () => {
    const options = { places: [buildOfferDetail().place], categoryNames: ['ألبسة'] };
    const optionsResponse = firstValueFrom(repository.getFormOptions());
    const itemsResponse = firstValueFrom(repository.getPlaceItems('place-7'));

    http.expectOne(`${BASE_URL}/offers/form-options`).flush(options);
    http.expectOne(`${BASE_URL}/places/place-7/offer-items`).flush([]);

    expect(await optionsResponse).toEqual(options);
    expect(await itemsResponse).toEqual([]);
  });

  it('creates with a POST and updates with a PUT, both as form data', async () => {
    const created = firstValueFrom(repository.createOffer(buildOfferDraft()));
    const updated = firstValueFrom(repository.updateOffer('offer-2', buildOfferDraft()));

    const create = http.expectOne(`${BASE_URL}/offers`);
    const update = http.expectOne(`${BASE_URL}/offers/offer-2`);
    expect([create.request.method, update.request.method]).toEqual(['POST', 'PUT']);
    expect(create.request.body).toBeInstanceOf(FormData);
    expect((update.request.body as FormData).get('placeId')).toBe('place-7');
    create.flush(buildOffer());
    update.flush(buildOffer({ id: 'offer-2' }));

    expect((await created).id).toBe('offer-1');
    expect((await updated).id).toBe('offer-2');
  });
});
