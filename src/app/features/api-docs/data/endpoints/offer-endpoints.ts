import { ApiFeature } from '../../models/api-feature';
import {
  CAMPAIGN_SUMMARY,
  OFFER_DETAIL,
  OFFER_FORM,
  OFFER_FORM_OPTIONS,
  OFFER_ROW,
} from '../examples/campaign-examples';
import {
  EMPTY_BODY_NOTE,
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  csvDownload,
  exportQuery,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';
import {
  CAMPAIGN_STATUS,
  CAMPAIGN_STATUS_RULES,
  CAMPAIGN_SUMMARY_FIELDS,
  NOT_PAUSABLE,
  NOT_PAUSED,
  RUNNING_RANGE_FIELDS,
  SAVED_CAMPAIGN_STATUS,
} from './campaign-fields';

const OFFER_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('status', CAMPAIGN_STATUS),
  optionalField('placeId', 'string'),
  ...RUNNING_RANGE_FIELDS,
];

const OFFER_ROW_FIELDS = [
  field('id / title', 'string'),
  field('place', 'object', '{ id, name }'),
  field('category', 'object', '{ id, name }'),
  field('discountPercent', 'integer 1-99'),
  field('startsOn / endsOn', 'date (yyyy-mm-dd)', 'Both days included.'),
  field('status', CAMPAIGN_STATUS),
];

const OFFER_FORM_FIELDS = [
  field('title', 'string', 'Max 120.'),
  field('discountPercent', 'integer', '1 to 99.'),
  field('placeId', 'string', 'An active place.'),
  field('categoryId', 'string', 'A category from form-options.'),
  field(
    'startsOn / endsOn',
    'date (yyyy-mm-dd)',
    'endsOn on or after startsOn. A new active offer cannot end in the past.',
  ),
  field('status', SAVED_CAMPAIGN_STATUS, 'scheduled and expired are worked out, never sent.'),
  field('description', 'string', 'Max 1000.'),
  field('scope', 'enum: allItems | selectedItems'),
  optionalField(
    'itemIds[]',
    'string[] (repeated field)',
    'Required and non-empty when scope is selectedItems; each a product of placeId.',
  ),
  optionalField('image', 'file (png, jpg, webp; max 5 MB)'),
  field('isImageRemoved', 'boolean', 'true: delete the saved image. false with no file: keep it.'),
];

export const OFFERS_FEATURE: ApiFeature = {
  id: 'offers',
  name: 'Offers',
  app: 'admin',
  screen: '/admin/offers',
  permissionModule: 'offers',
  intro:
    'Discounts tied to a place, on everything it sells or only on picked products: list, summary, detail, create, edit, pause/resume, delete and CSV export.',
  endpoints: [
    {
      id: 'offers-list',
      method: 'GET',
      path: '/offers',
      summary: 'The paged offers table.',
      queryParams: OFFER_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([OFFER_ROW], 48),
        fields: OFFER_ROW_FIELDS,
      },
      notes: CAMPAIGN_STATUS_RULES,
    },
    {
      id: 'offers-summary',
      method: 'GET',
      path: '/offers/summary',
      summary: 'The four cards above the offers table.',
      response: {
        status: 200,
        description: 'Counts over the whole table.',
        example: CAMPAIGN_SUMMARY,
        fields: CAMPAIGN_SUMMARY_FIELDS,
      },
      notes: ['Same shape as /ads/summary.'],
    },
    {
      id: 'offers-detail',
      method: 'GET',
      path: '/offers/{id}',
      summary: 'One offer with everything the edit form needs.',
      response: {
        status: 200,
        description: 'The row fields plus the form fields, all at the top level.',
        example: OFFER_DETAIL,
        fields: [
          field('(row fields)', '', 'As in the list row.'),
          field('description', 'string'),
          field('scope', 'enum: allItems | selectedItems'),
          field('itemIds', 'string[]', '[] when scope is allItems.'),
          field('imageUrl', 'string (url) | null'),
          field('createdAt / updatedAt', 'datetime (ISO 8601)'),
        ],
      },
    },
    {
      id: 'offers-pause',
      method: 'POST',
      path: '/offers/{id}/pause',
      summary: 'Pause an offer.',
      permission: 'offers:edit',
      response: {
        status: 200,
        description: 'The row, now paused.',
        example: { ...OFFER_ROW, status: 'paused' },
      },
      errors: [NOT_PAUSABLE],
      notes: [EMPTY_BODY_NOTE],
    },
    {
      id: 'offers-resume',
      method: 'POST',
      path: '/offers/{id}/resume',
      summary: 'Resume a paused offer.',
      permission: 'offers:edit',
      response: {
        status: 200,
        description: 'The row, status worked out again from its dates.',
        example: OFFER_ROW,
      },
      errors: [NOT_PAUSED],
      notes: [
        EMPTY_BODY_NOTE,
        'A resumed offer that starts in the future is scheduled, not active.',
      ],
    },
    {
      id: 'offers-form-options',
      method: 'GET',
      path: '/offers/form-options',
      summary: 'The dropdowns of the offer form.',
      response: {
        status: 200,
        description: 'Active places and categories.',
        example: OFFER_FORM_OPTIONS,
        fields: [
          field(
            'places[]',
            'object',
            '{ id, name, category { id, name }, address }. The form shows category and address once a place is picked.',
          ),
          field('categories[]', 'object', '{ id, name }'),
        ],
      },
    },
    {
      id: 'offers-create',
      method: 'POST',
      path: '/offers',
      summary: 'Create an offer.',
      body: { contentType: 'multipart/form-data', fields: OFFER_FORM_FIELDS, example: OFFER_FORM },
      response: {
        status: 201,
        description: 'The new offer, in the detail shape.',
        example: OFFER_DETAIL,
      },
      notes: [
        'Only a discount percent is stored: no original or discounted prices, no offer currency and no featured flag.',
      ],
    },
    {
      id: 'offers-update',
      method: 'PUT',
      path: '/offers/{id}',
      summary: 'Update an offer.',
      body: { contentType: 'multipart/form-data', fields: OFFER_FORM_FIELDS, example: OFFER_FORM },
      response: {
        status: 200,
        description: 'The updated offer, in the detail shape.',
        example: OFFER_DETAIL,
      },
      notes: ['Multipart on PUT: see the note on PUT /places/{id}.'],
    },
    {
      id: 'offers-delete',
      method: 'DELETE',
      path: '/offers/{id}',
      summary: 'Delete an offer.',
      response: NO_CONTENT,
    },
    {
      id: 'offers-export',
      method: 'GET',
      path: '/offers/export',
      summary: 'Download the filtered offers as CSV.',
      queryParams: exportQuery(OFFER_FILTER_FIELDS),
      response: csvDownload('offer'),
    },
  ],
};
