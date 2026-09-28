import { DbColumn } from '../../models/db-column';
import { DbDomain } from '../../models/db-domain';
import { ID, TIMESTAMPS, adminReference, foreignKey } from './db-columns';

const STATUS_FLAGS: readonly DbColumn[] = [
  {
    name: 'is_paused',
    type: 'boolean',
    note: 'Status is worked out from these flags and the dates.',
  },
  { name: 'is_draft', type: 'boolean' },
];

export const CAMPAIGN_DOMAIN: DbDomain = {
  id: 'db-campaigns',
  name: 'Offers and ads',
  description:
    'Discounts and banners. Neither stores a status column: it is worked out from the flags and dates.',
  layout: [
    ['offers', 'offer_products'],
    ['ads', 'ad_events'],
  ],
  tables: [
    {
      name: 'offers',
      description: 'A discount at one place.',
      servedAs: '/offers',
      columns: [
        ID,
        foreignKey('place_id', 'places.id'),
        foreignKey('category_id', 'categories.id', 'The form sends categoryName: look it up.'),
        { name: 'title', type: 'varchar(120)' },
        { name: 'description', type: 'text' },
        { name: 'discount_percent', type: 'tinyint unsigned', note: '1-100.' },
        { name: 'scope', type: "enum('allItems','selectedItems')" },
        { name: 'starts_on', type: 'date' },
        { name: 'ends_on', type: 'date' },
        ...STATUS_FLAGS,
        { name: 'image_path', type: 'varchar(255)', isNullable: true },
        adminReference('created_by_admin_id', ''),
        ...TIMESTAMPS,
      ],
      indexes: ['INDEX (starts_on, ends_on)'],
    },
    {
      name: 'offer_products',
      description: 'The picked products when scope is selectedItems.',
      servedAs: 'itemIds on /offers/{id}',
      columns: [
        { ...foreignKey('offer_id', 'offers.id', 'Cascade on delete.'), key: 'pk' },
        { ...foreignKey('product_id', 'products.id', 'Cascade on delete.'), key: 'pk' },
      ],
      indexes: ['PRIMARY (offer_id, product_id)'],
    },
    {
      name: 'ads',
      description: 'A banner shown in the app.',
      servedAs: '/ads',
      columns: [
        ID,
        { name: 'title', type: 'varchar(120)' },
        { name: 'advertiser_type', type: "enum('place','admin')" },
        foreignKey('place_id', 'places.id', 'null when advertiser_type is admin.', true),
        { name: 'content_type', type: "enum('image','video')" },
        { name: 'text', type: 'varchar(300)' },
        { name: 'placement', type: "enum('home','searchResults','categories','placeDetails')" },
        { name: 'position', type: "enum('topBanner','middleBanner','bottomBanner')" },
        { name: 'priority', type: 'tinyint unsigned', note: '1-5. 5 shows first.' },
        { name: 'starts_on', type: 'date' },
        { name: 'ends_on', type: 'date', isNullable: true, note: 'null: never ends.' },
        ...STATUS_FLAGS,
        { name: 'media_path', type: 'varchar(255)', isNullable: true },
        adminReference('created_by_admin_id', ''),
        adminReference('updated_by_admin_id', 'Served as updatedBy (the name).'),
        ...TIMESTAMPS,
      ],
      indexes: ['INDEX (placement, position, priority)'],
    },
    {
      name: 'ad_events',
      description: 'One row per impression or click. Rolled up for metrics.',
      servedAs: 'metrics on /ads/{id}',
      columns: [
        ID,
        foreignKey('ad_id', 'ads.id', 'Cascade on delete.'),
        foreignKey('user_id', 'users.id', 'Counted for uniqueUsers.', true),
        { name: 'device_id', type: 'varchar(64)', note: 'For visitors with no user_id.' },
        { name: 'type', type: "enum('impression','click')" },
        { name: 'occurred_at', type: 'timestamp' },
      ],
      indexes: ['INDEX (ad_id, type)'],
    },
  ],
};
