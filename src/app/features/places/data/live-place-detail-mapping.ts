import { DeliveryLink } from '../../../shared/models/delivery-link';
import { CurrencyCode } from '../../../shared/money/currency-code';
import { formatArabicRelativeTime } from '../../../shared/formatting/arabic-relative-time';
import { formatLatinDigitDate } from '../../../shared/formatting/latin-digit-date';
import { PlaceDetail } from '../models/place-detail';
import { PlaceOffer } from '../models/place-offer';
import { PlaceProduct } from '../models/place-product';
import { PlaceSubscription } from '../models/place-subscription';
import {
  LiveDeliveryLink,
  LivePlaceDetail,
  LivePlaceOffer,
  LivePlaceProduct,
} from './live-place-detail';
import { toPlacePackage, toPlaceStatus } from './live-place-mapping';
import { toWorkingHoursRows } from './live-working-hours';

const ACTIVE_OFFER = 'active';

export function toPlaceDetail(live: LivePlaceDetail, now: Date): PlaceDetail {
  const status = toPlaceStatus(live.status);
  return {
    id: live.id,
    code: live.code,
    name: live.name,
    publicUrl: live.publicUrl ?? '',
    status,
    description: live.description ?? '',
    mainCategory: live.mainCategory?.name ?? '',
    subCategory: live.subCategory?.name ?? '',
    images: live.images.map((image) => image.url),
    owner: {
      name: live.owner?.name ?? '',
      phone: live.owner?.phone ?? '',
      extraPhone: live.owner?.extraPhone ?? '',
    },
    subscription: toSubscription(live, status),
    activity: {
      addedAt: live.createdAt,
      updatedLabel: formatArabicRelativeTime(live.updatedAt, now),
    },
    contact: {
      phone: live.contact?.phone ?? '',
      extraPhone: live.contact?.extraPhone ?? '',
      website: live.contact?.website ?? '',
      whatsapp: live.contact?.whatsapp ?? '',
      facebook: live.contact?.facebook ?? '',
      instagram: live.contact?.instagram ?? '',
      telegram: live.contact?.telegram ?? '',
    },
    location: {
      city: live.location?.governorate?.name ?? '',
      region: live.location?.area?.name ?? '',
      address: live.location?.address ?? '',
      latitude: live.location?.latitude ?? 0,
      longitude: live.location?.longitude ?? 0,
    },
    workingHours: toWorkingHoursRows(live.workingHours, now),
    products: live.products.map(toProduct),
    offers: live.offers.map(toOffer),
    videos: live.videos.map((video) => ({
      id: video.id,
      url: video.url,
      posterUrl: video.posterUrl ?? '',
      duration: video.duration ?? '',
    })),
    deliveryLinks: live.deliveryLinks.map(toDeliveryLink),
    isOpenNow: live.isOpenNow,
  };
}

function toSubscription(live: LivePlaceDetail, placeStatus: PlaceSubscription['status']) {
  if (!live.subscription) {
    return { package: 'free', status: placeStatus, renewsAt: '' } satisfies PlaceSubscription;
  }
  return {
    package: toPlacePackage(live.subscription.plan.tier),
    status: toPlaceStatus(live.subscription.status),
    renewsAt: live.subscription.endsOn ?? '',
  } satisfies PlaceSubscription;
}

function toProduct(product: LivePlaceProduct): PlaceProduct {
  return {
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency as CurrencyCode,
    imageUrl: product.imageUrl ?? '',
    isAvailable: product.isAvailable,
    orderUrl: product.orderUrl ?? '',
  };
}

function toOffer(offer: LivePlaceOffer): PlaceOffer {
  return {
    id: offer.id,
    title: offer.title,
    description: offer.description ?? '',
    dateRange: `${formatLatinDigitDate(offer.startsOn)} - ${formatLatinDigitDate(offer.endsOn)}`,
    imageUrl: offer.imageUrl ?? '',
    isActive: offer.status === ACTIVE_OFFER,
  };
}

// The server keeps the app as free text, not as one of the admin's delivery platforms.
function toDeliveryLink(link: LiveDeliveryLink): DeliveryLink {
  return {
    platform: { id: link.platform, name: link.platform, latinName: link.platform, logoUrl: null },
    isEnabled: link.isEnabled,
    storeUrl: link.storeUrl,
  };
}
