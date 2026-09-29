import { field, optionalField } from '../shared-fields';

/** How a place's ordering apps are read, on /owner/place and /places/{id} alike. */
export const DELIVERY_LINK_FIELDS = [
  field(
    'deliveryLinks',
    'object[]',
    'One row for every active delivery_platforms row, by sort_order, even if the place never set it up (then isEnabled false, storeUrl null).',
  ),
  field('deliveryLinks[].platform', 'object', '{ id, name, latinName, logoUrl | null }.'),
  field('deliveryLinks[].isEnabled', 'boolean', 'Shown to app users only when true.'),
  field(
    'deliveryLinks[].storeUrl',
    'string (url) | null',
    "The place's page on that app. Kept while switched off.",
  ),
];

/** How the same links are saved from a multipart form. */
export const DELIVERY_LINK_WRITE_FIELDS = [
  field(
    'deliveryLinks[n][platformId] / [isEnabled]',
    'string / boolean',
    'Every active platform the form listed, n = 0, 1, … in the same order.',
  ),
  optionalField(
    'deliveryLinks[n][storeUrl]',
    'string (url)',
    'Full https URL. Required when isEnabled is true; left out when empty.',
  ),
];
