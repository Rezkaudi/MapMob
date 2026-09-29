import { ApiFeature } from '../../models/api-feature';
import {
  OWNER_OFFER,
  OWNER_OFFER_CATALOG,
  OWNER_OFFER_FORM,
} from '../examples/owner-offer-examples';
import { EMPTY_BODY_NOTE, NO_CONTENT, field, optionalField } from '../shared-fields';
import {
  CAMPAIGN_STATUS,
  CAMPAIGN_STATUS_RULES,
  NOT_PAUSABLE,
  NOT_PAUSED,
  SAVED_CAMPAIGN_STATUS,
} from './campaign-fields';

const NOT_THEIR_OFFER = {
  status: 404,
  when: 'The offer does not exist or belongs to another place.',
  example: { message: 'Offer not found.' },
};
const OVER_LIMIT = {
  status: 422,
  when: 'The offer would be live (active or scheduled) and the place already has activeOfferLimit live offers.',
  example: { message: 'The current plan allows no more live offers.' },
};

const OFFER_FIELDS = [
  field('id', 'string'),
  field('title', 'string'),
  field('description', 'string | null', 'null when the owner left it blank.'),
  field('discountPercent', 'integer', '1 to 100.'),
  field('scope', 'enum: allItems | selectedItems'),
  field('itemIds[]', 'string[]', 'Ids from GET /owner/products. [] when scope is allItems.'),
  field('startsOn / endsOn', 'date (yyyy-mm-dd)', 'Both days included.'),
  field('status', CAMPAIGN_STATUS),
  field(
    'imageUrl',
    'string (url) | null',
    "offers.image_path; null draws the title's first letter.",
  ),
  field('createdAt', 'string (ISO 8601)', 'Sorts the table by newest or oldest.'),
];

const OFFER_WRITE_FIELDS = [
  field('title', 'string', 'Max 120.'),
  field('discountPercent', 'integer', '1 to 100.'),
  field('startsOn / endsOn', 'date (yyyy-mm-dd)', 'endsOn on or after startsOn.'),
  field('status', SAVED_CAMPAIGN_STATUS, 'scheduled and expired are worked out, never sent.'),
  field('description', 'string', 'Max 1000. Empty when left blank: store null.'),
  field('scope', 'enum: allItems | selectedItems'),
  optionalField(
    'itemIds[]',
    'string[] (repeated field)',
    "Required and non-empty when scope is selectedItems; each a product of the owner's place.",
  ),
  optionalField('image', 'file (JPG or PNG, max 5 MB)', 'Sent only when a new picture was picked.'),
  field(
    'isImageRemoved',
    'boolean',
    'true: delete the saved picture. false with no file: keep it.',
  ),
];

export const OWNER_OFFERS_FEATURE: ApiFeature = {
  id: 'owner-offers',
  name: 'Place owner offers',
  app: 'owner',
  screen: '/merchant/offers',
  permissionModule: null,
  intro:
    'The owner lists, adds, edits, pauses and deletes the offers of their own place. The screen reads every offer in one call and searches, filters, sorts and counts them itself, so the list is not paged. The products an offer can cover come from GET /owner/products.',
  endpoints: [
    {
      id: 'owner-offers-list',
      method: 'GET',
      path: '/owner/offers',
      summary: "Every offer of the signed-in owner's place, with the plan's live-offer limit.",
      response: {
        status: 200,
        description: 'One object for the whole screen.',
        example: OWNER_OFFER_CATALOG,
        fields: [
          field('plan', 'object', '{ id, name } of the current subscription.'),
          field(
            'activeOfferLimit',
            'number | null',
            'plans.limit_active_offers of the current plan; null = no cap.',
          ),
          field('items[]', 'object[]', 'Oldest first, drafts included. The fields below.'),
          ...OFFER_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
      notes: [
        ...CAMPAIGN_STATUS_RULES,
        'The usage card counts live offers (active and scheduled) against activeOfferLimit. The tiles count all offers, active ones and expired ones.',
      ],
    },
    {
      id: 'owner-offers-get',
      method: 'GET',
      path: '/owner/offers/{id}',
      summary: 'One offer, to fill the edit page.',
      response: {
        status: 200,
        description: 'Shaped like one of items[] in GET /owner/offers.',
        example: OWNER_OFFER,
      },
      errors: [NOT_THEIR_OFFER],
    },
    {
      id: 'owner-offers-create',
      method: 'POST',
      path: '/owner/offers',
      summary: 'Add an offer from the "إضافة عرض جديد" page ("حفظ العرض" or "حفظ كمسودة").',
      body: {
        contentType: 'multipart/form-data',
        fields: OFFER_WRITE_FIELDS,
        example: OWNER_OFFER_FORM,
      },
      response: {
        status: 201,
        description: 'The new offer, shaped like one of items[] in GET /owner/offers.',
        example: OWNER_OFFER,
      },
      errors: [OVER_LIMIT],
      notes: [
        "The place is the owner's own and the category is that place's main category: neither is sent.",
        'The screen turns the add button off at the limit, but the server must still refuse with 422. A draft or a paused offer is never live, so it is always accepted.',
      ],
    },
    {
      id: 'owner-offers-update',
      method: 'PUT',
      path: '/owner/offers/{id}',
      summary: 'Save an offer changed on the "تعديل العرض" page.',
      body: {
        contentType: 'multipart/form-data',
        fields: OFFER_WRITE_FIELDS,
        example: OWNER_OFFER_FORM,
      },
      response: {
        status: 200,
        description: 'The saved offer, status worked out again.',
        example: OWNER_OFFER,
      },
      errors: [NOT_THEIR_OFFER, OVER_LIMIT],
      notes: [
        'The screen always sends the whole form. When scope is allItems, clear the saved itemIds.',
        'PHP does not read multipart bodies on PUT. Parse the body yourself (for example in a middleware).',
      ],
    },
    {
      id: 'owner-offers-pause',
      method: 'POST',
      path: '/owner/offers/{id}/pause',
      summary: 'Pause an offer from "إيقاف العرض" in the detail drawer.',
      response: {
        status: 200,
        description: 'The offer, now paused.',
        example: { ...OWNER_OFFER, status: 'paused' },
      },
      errors: [NOT_THEIR_OFFER, NOT_PAUSABLE],
      notes: [EMPTY_BODY_NOTE],
    },
    {
      id: 'owner-offers-resume',
      method: 'POST',
      path: '/owner/offers/{id}/resume',
      summary: 'Resume a paused offer from "تفعيل العرض".',
      response: {
        status: 200,
        description: 'The offer, status worked out again from its days.',
        example: OWNER_OFFER,
      },
      errors: [NOT_THEIR_OFFER, NOT_PAUSED, OVER_LIMIT],
      notes: [EMPTY_BODY_NOTE],
    },
    {
      id: 'owner-offers-delete',
      method: 'DELETE',
      path: '/owner/offers/{id}',
      summary: 'Delete an offer after the owner confirms.',
      response: NO_CONTENT,
      errors: [NOT_THEIR_OFFER],
      notes: ['Also delete its stored picture and its offer_products rows.'],
    },
  ],
};
