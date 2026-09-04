import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { mockResponse } from '../../../../mock/mock-delay';
import { paginate } from '../../../../mock/paginate';
import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { Place } from '../models/place';
import { PlaceQuery } from '../models/place-query';
import { PlaceStatus } from '../models/place-status';
import { PlaceRepository } from './place.repository';

const TOTAL_PLACE_COUNT = 120;
const NAMES = ['صيدلية الحياة', 'مطعم الأصالة', 'مقهى الزاوية', 'سوبر ماركت النور', 'عيادة الشفاء'];
const CATEGORIES = ['صيدلية', 'مطعم', 'مقهى', 'سوبر ماركت', 'عيادة'];
const CITIES = ['الرياض', 'جدة', 'الدمام'];
const STATUSES: readonly PlaceStatus[] = ['active', 'active', 'active', 'pending', 'suspended'];

function buildPlace(index: number): Place {
  const next = createSeededRandom(index + 1);
  return {
    id: `place-${index + 1}`,
    name: pickOne(next, NAMES),
    category: pickOne(next, CATEGORIES),
    city: pickOne(next, CITIES),
    rating: randomInt(next, 35, 50) / 10,
    status: pickOne(next, STATUSES),
    joinedAt: new Date(2024, 0, randomInt(next, 1, 28)).toISOString(),
  };
}

const ALL_PLACES: readonly Place[] = Array.from({ length: TOTAL_PLACE_COUNT }, (_, i) =>
  buildPlace(i),
);

@Injectable()
export class PlaceMockRepository implements PlaceRepository {
  getPlaces(query: PlaceQuery): Observable<PagedResult<Place>> {
    const filtered = ALL_PLACES.filter((place) => {
      const matchesStatus = !query.status || place.status === query.status;
      const matchesSearch = !query.search || place.name.includes(query.search);
      return matchesStatus && matchesSearch;
    });
    return mockResponse(paginate(filtered, query.pageIndex, query.pageSize));
  }
}
