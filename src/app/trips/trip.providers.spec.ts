import { TestBed } from '@angular/core/testing';
import { provideStore, Store } from '@ngrx/store';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideTripsFeature } from './trip.providers';
import { selectAllTrips } from './state/trip.selectors';
import { provideApiBaseUrl } from '../core/api-base-url';

describe('provideTripsFeature', () => {
  it('adds the trips feature to the store', () => {
    TestBed.configureTestingModule({
      providers: [
        provideStore(),
        provideHttpClient(),
        provideHttpClientTesting(),
        provideApiBaseUrl(),
        provideTripsFeature(),
      ],
    });

    const store = TestBed.inject(Store);

    expect(store.selectSignal(selectAllTrips)()).toEqual([]);
  });
});
