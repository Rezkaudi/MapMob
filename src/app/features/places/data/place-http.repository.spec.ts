import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { API_BASE_URL } from '../../../core/config/api-base-url';
import { createPlace } from '../testing/place-fixture';
import { PlaceHttpRepository } from './place-http.repository';

const BASE_URL = 'https://api.test';

describe('PlaceHttpRepository', () => {
  let repository: PlaceHttpRepository;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        PlaceHttpRepository,
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: API_BASE_URL, useValue: BASE_URL },
      ],
    });
    repository = TestBed.inject(PlaceHttpRepository);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('asks for a page of places with the filters', async () => {
    const page = { items: [createPlace()], totalCount: 1 };
    const response = firstValueFrom(
      repository.getPlaces({ pageIndex: 0, pageSize: 8, status: 'pending', sort: 'rating' }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/places`);
    expect(request.request.params.get('status')).toBe('pending');
    expect(request.request.params.get('sort')).toBe('rating');
    request.flush(page);

    expect(await response).toEqual(page);
  });

  it('sends one status change for every named place', async () => {
    const response = firstValueFrom(repository.setPlacesStatus(['place-1', 'place-2'], 'active'));

    const request = http.expectOne(`${BASE_URL}/places/status`);
    expect(request.request.method).toBe('PATCH');
    expect(request.request.body).toEqual({ ids: ['place-1', 'place-2'], status: 'active' });
    request.flush(null);

    await response;
  });

  it('sends one delete for every named place', async () => {
    const response = firstValueFrom(repository.deletePlaces(['place-1']));

    const request = http.expectOne(`${BASE_URL}/places/delete`);
    expect(request.request.method).toBe('POST');
    expect(request.request.body).toEqual({ ids: ['place-1'] });
    request.flush(null);

    await response;
  });

  it('asks the export endpoint for a file, naming the ticked rows', async () => {
    const response = firstValueFrom(
      repository.exportPlaces({
        query: { pageIndex: 0, pageSize: 8, category: 'مطعم' },
        ids: ['place-1', 'place-2'],
      }),
    );

    const request = http.expectOne((candidate) => candidate.url === `${BASE_URL}/places/export`);
    expect(request.request.responseType).toBe('blob');
    expect(request.request.params.get('category')).toBe('مطعم');
    expect(request.request.params.getAll('ids')).toEqual(['place-1', 'place-2']);
    request.flush(new Blob(['name']));

    expect(await response).toBeInstanceOf(Blob);
  });
});
