import { MOCK_PLACES } from '../../../../mock/mock-places';
import { NotificationAudience } from '../models/notification-audience';
import { NotificationRecipient } from '../models/notification-recipient';

const FIRST_NAMES = ['سارة', 'محمد', 'ليلى', 'أحمد', 'رنا', 'علي', 'هبة', 'يوسف'];
const FAMILY_NAMES = ['أحمد التميمي', 'خالد الحسن', 'سليم العلي', 'نادر الشامي'];
const CITIES = ['طرطوس', 'دمشق', 'حمص', 'اللاذقية'];
const USER_COUNT = 24;
const PHONE_PREFIX = '05012345';
const PHONE_SUFFIX_LENGTH = 2;
const ADDRESS_SEPARATOR = '،';

const users: readonly NotificationRecipient[] = Array.from({ length: USER_COUNT }, (_, index) => ({
  id: `recipient-${index + 1}`,
  name: `${FIRST_NAMES[index % FIRST_NAMES.length]} ${FAMILY_NAMES[index % FAMILY_NAMES.length]}`,
  phone: `${PHONE_PREFIX}${String(index + 60).padStart(PHONE_SUFFIX_LENGTH, '0')}`,
  city: CITIES[index % CITIES.length],
}));

const companies: readonly NotificationRecipient[] = MOCK_PLACES.map((place, index) => ({
  id: place.id,
  name: place.name,
  phone: `${PHONE_PREFIX}${String(index + 10).padStart(PHONE_SUFFIX_LENGTH, '0')}`,
  city: place.address.split(ADDRESS_SEPARATOR)[0].trim(),
}));

export const NOTIFICATION_MOCK_RECIPIENTS: Record<
  NotificationAudience,
  readonly NotificationRecipient[]
> = {
  users,
  companies,
};

export function searchRecipients(
  audience: NotificationAudience,
  search: string,
): readonly NotificationRecipient[] {
  const term = search.trim();
  return NOTIFICATION_MOCK_RECIPIENTS[audience].filter(
    (recipient) => !term || recipient.name.includes(term) || recipient.phone.includes(term),
  );
}
