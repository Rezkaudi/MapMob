import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TripApi } from './trip-api';
import { provideApiBaseUrl, API_BASE_URL } from '../core/api-base-url';
import { Trip } from './trip';

describe('TripApi', () => {
  let tripApi: TripApi;
  let httpController: HttpTestingController;
  let apiBaseUrl: string;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideApiBaseUrl()],
    });
    tripApi = TestBed.inject(TripApi);
    httpController = TestBed.inject(HttpTestingController);
    apiBaseUrl = TestBed.inject(API_BASE_URL);
  });

  afterEach(() => httpController.verify());

  it('asks the backend for every trip', () => {
    const trips: Trip[] = [{ id: '1', startedAt: '2026-09-04T08:00:00Z', distanceInKm: 12.5 }];
    let received: readonly Trip[] | undefined;

    tripApi.getTrips().subscribe((result) => (received = result));

    const request = httpController.expectOne(`${apiBaseUrl}/trips`);
    expect(request.request.method).toBe('GET');
    request.flush(trips);

    expect(received).toEqual(trips);
  });
});
