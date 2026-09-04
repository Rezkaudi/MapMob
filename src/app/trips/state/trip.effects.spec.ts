import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, firstValueFrom, of, throwError } from 'rxjs';
import { TripEffects } from './trip.effects';
import { loadTrips, loadTripsFailure, loadTripsSuccess } from './trip.actions';
import { TripApi } from '../trip-api';
import { Trip } from '../trip';

const trips: readonly Trip[] = [{ id: '1', startedAt: '2026-09-04T08:00:00Z', distanceInKm: 12.5 }];

function setUp(getTrips: () => Observable<readonly Trip[]>): TripEffects {
  TestBed.configureTestingModule({
    providers: [
      TripEffects,
      provideMockActions(() => of(loadTrips())),
      { provide: TripApi, useValue: { getTrips } },
    ],
  });

  return TestBed.inject(TripEffects);
}

describe('TripEffects', () => {
  it('sends the trips on when the backend answers', async () => {
    const effects = setUp(() => of(trips));

    await expect(firstValueFrom(effects.loadTrips$)).resolves.toEqual(loadTripsSuccess({ trips }));
  });

  it('sends a message on when the backend fails', async () => {
    const effects = setUp(() => throwError(() => new Error('Network down')));

    await expect(firstValueFrom(effects.loadTrips$)).resolves.toEqual(
      loadTripsFailure({ error: 'Network down' }),
    );
  });
});
