import { DbDomain } from '../models/db-domain';
import { ACCESS_DOMAIN } from './database/access-tables';
import { BILLING_DOMAIN } from './database/billing-tables';
import { CAMPAIGN_DOMAIN } from './database/campaign-tables';
import { CATALOG_DOMAIN } from './database/catalog-tables';
import { COMMUNITY_DOMAIN } from './database/community-tables';
import { CONTENT_DOMAIN } from './database/content-tables';
import { LOCATION_DOMAIN } from './database/location-tables';
import { MESSAGING_DOMAIN } from './database/messaging-tables';
import { OWNER_DOMAIN } from './database/owner-tables';

export const DATABASE_DOMAINS: readonly DbDomain[] = [
  LOCATION_DOMAIN,
  CATALOG_DOMAIN,
  COMMUNITY_DOMAIN,
  CAMPAIGN_DOMAIN,
  BILLING_DOMAIN,
  MESSAGING_DOMAIN,
  CONTENT_DOMAIN,
  ACCESS_DOMAIN,
  OWNER_DOMAIN,
];
