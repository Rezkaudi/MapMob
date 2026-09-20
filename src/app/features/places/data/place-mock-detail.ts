import { Place } from '../models/place';
import { PlaceDetail } from '../models/place-detail';
import { PlaceOffer } from '../models/place-offer';
import { PlaceProduct } from '../models/place-product';
import { PlaceVideo } from '../models/place-video';

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
const PRODUCT_COUNT = 2;
const OFFER_COUNT = 3;

const PRODUCTS: readonly PlaceProduct[] = Array.from({ length: PRODUCT_COUNT }, (_, index) => ({
  id: `product-${index + 1}`,
  name: 'سيروم تحت العين',
  price: 200,
  currency: 'ل.س',
  imageUrl: `${IMAGES}/product-facial.jpg`,
  isAvailable: true,
  orderUrl: '',
}));

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
  { id: 'video-1', url: '', posterUrl: `${IMAGES}/place-cover.jpg`, duration: '01:24' },
];

export function buildMockPlaceDetail(place: Place): PlaceDetail {
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
