import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult } from '../../../core/models/paged-result';
import { mockResponse } from '../../../../mock/mock-delay';
import { paginate } from '../../../../mock/paginate';
import { createSeededRandom, pickOne, randomInt } from '../../../../mock/random';
import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceProduct } from '../models/place-product';
import { PlaceOffer } from '../models/place-offer';
import { PlaceVideo } from '../models/place-video';
import { PlacePackage } from '../models/place-package';
import { PlaceQuery } from '../models/place-query';
import { PlaceSort } from '../models/place-sort';
import { PlaceStatus } from '../models/place-status';
import { PlaceStatusCounts } from '../models/place-status-counts';
import { PlaceRepository } from './place.repository';

const DESCRIPTION =
  'صيدلية الحياة تقدم مجموعة واسعة من الأدوية والمستلزمات الطبية ومنتجات العناية الشخصية والتجميل. ' +
  'نحرص على تقديم أفضل خدمة صيدلانية مع استشارات طبية متخصصة من قبل صيادلة مؤهلين.';

const IMAGES = 'assets/images';

const WORKING_HOURS = [
  { days: 'الأحد - الخميس', hours: '09:00 AM - 11:00 PM', isToday: false },
  { days: 'الجمعة', hours: '04:00 PM - 11:00 PM', isToday: false },
  { days: 'السبت (اليوم)', hours: '10:00 AM - 10:00 PM', isToday: true },
];

/** The two rows the place-detail design draws in the products table. */
const PRODUCTS: readonly PlaceProduct[] = Array.from({ length: 2 }, (_, index) => ({
  id: `product-${index + 1}`,
  name: 'سيروم تحت العين',
  price: 200,
  currency: 'ل.س',
  imageUrl: `${IMAGES}/product-facial.jpg`,
  isAvailable: true,
  orderUrl: '',
}));

const OFFER_COUNT = 3;

const OFFERS: readonly PlaceOffer[] = Array.from({ length: OFFER_COUNT }, (_, index) => ({
  id: `offer-${index + 1}`,
  title: 'خصم 20 % على جميع المنتجات',
  description: 'خصم خاص لفترة محدودة على كافة أصناف المكملات الغذائية',
  dateRange: '01 - 15 سبتمبر 2026',
  imageUrl: `${IMAGES}/offer-cosmetics.jpg`,
  isActive: true,
}));

const GALLERY: readonly string[] = [
  `${IMAGES}/place-cover.jpg`,
  `${IMAGES}/place-shelf.jpg`,
  `${IMAGES}/place-pills.jpg`,
];

const VIDEOS: readonly PlaceVideo[] = [
  {
    id: 'video-1',
    url: '',
    posterUrl: `${IMAGES}/place-cover.jpg`,
    duration: '01:24',
  },
];

function buildPlaceDetail(place: Place): PlaceDetail {
  return {
    id: place.id,
    code: place.code,
    name: place.name,
    status: place.status,
    description: DESCRIPTION,
    mainCategory: 'صيدليات',
    subCategory: 'صيدليات',
    images: GALLERY,
    owner: { name: 'أحمد عبدالله', phone: '096077789' },
    subscription: {
      package: place.package,
      status: place.status,
      renewsAt: '2024-10-24T00:00:00.000Z',
    },
    activity: { addedAt: '2024-10-24T00:00:00.000Z', updatedLabel: 'منذ يومين' },
    contact: {
      phone: '+966 50 123 4567',
      whatsapp: '+966 50 123 4567',
      facebook: 'https://facebook.com/alhayatpharmacy',
      instagram: 'https://instagram.com/alhayatpharmacy',
    },
    location: {
      city: 'طرطوس',
      address: 'طرطوس ، شارع الثورة، بجانب',
      latitude: 34.889,
      longitude: 35.886,
    },
    workingHours: WORKING_HOURS,
    products: PRODUCTS,
    offers: OFFERS,
    videos: VIDEOS,
    isOpenNow: true,
  };
}

const TOTAL_PLACE_COUNT = 120;
const FIRST_PLACE_CODE = 1024;
const NAMES = ['صيدلية الحياة', 'مطعم الأصالة', 'مقهى الزاوية', 'سوبر ماركت النور', 'عيادة الشفاء'];
const CATEGORIES = ['صيدلية', 'مطعم', 'مقهى', 'سوبر ماركت', 'عيادة'];
const CITIES = ['الرياض', 'جدة', 'الدمام'];
const STATUSES: readonly PlaceStatus[] = ['active', 'active', 'active', 'pending', 'suspended'];
const PACKAGES: readonly PlacePackage[] = ['free', 'basic', 'basic', 'premium'];

function buildPlace(index: number): Place {
  const next = createSeededRandom(index + 1);
  return {
    id: `place-${index + 1}`,
    code: String(FIRST_PLACE_CODE + index),
    name: pickOne(next, NAMES),
    logoUrl: `${IMAGES}/place-logo.jpg`,
    category: pickOne(next, CATEGORIES),
    city: pickOne(next, CITIES),
    rating: randomInt(next, 35, 50) / 10,
    status: pickOne(next, STATUSES),
    package: pickOne(next, PACKAGES),
    joinedAt: new Date(2024, 0, randomInt(next, 1, 28)).toISOString(),
  };
}

const ALL_PLACES: readonly Place[] = Array.from({ length: TOTAL_PLACE_COUNT }, (_, i) =>
  buildPlace(i),
);

function compareBy(sort: PlaceSort): (left: Place, right: Place) => number {
  if (sort === 'rating') {
    return (left, right) => right.rating - left.rating;
  }
  if (sort === 'name') {
    return (left, right) => left.name.localeCompare(right.name, 'ar');
  }
  const direction = sort === 'oldest' ? 1 : -1;
  return (left, right) => direction * left.joinedAt.localeCompare(right.joinedAt);
}

@Injectable()
export class PlaceMockRepository implements PlaceRepository {
  getPlaces(query: PlaceQuery): Observable<PagedResult<Place>> {
    const filtered = ALL_PLACES.filter((place) => {
      const matchesStatus = !query.status || place.status === query.status;
      const matchesCategory = !query.category || place.category === query.category;
      const matchesPackage = !query.package || place.package === query.package;
      const matchesSearch =
        !query.search || place.name.includes(query.search) || place.city.includes(query.search);
      return matchesStatus && matchesCategory && matchesPackage && matchesSearch;
    });
    const sorted = query.sort ? [...filtered].sort(compareBy(query.sort)) : filtered;
    return mockResponse(paginate(sorted, query.pageIndex, query.pageSize));
  }

  getPlace(id: string): Observable<PlaceDetail> {
    const place = ALL_PLACES.find((candidate) => candidate.id === id) ?? ALL_PLACES[0];
    return mockResponse(buildPlaceDetail(place));
  }

  getStatusCounts(): Observable<PlaceStatusCounts> {
    const countOf = (status: PlaceStatus): number =>
      ALL_PLACES.filter((place) => place.status === status).length;
    return mockResponse({
      all: ALL_PLACES.length,
      active: countOf('active'),
      pending: countOf('pending'),
      suspended: countOf('suspended'),
    });
  }
}
