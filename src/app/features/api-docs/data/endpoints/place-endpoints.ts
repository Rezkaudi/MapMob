import { ApiFeature } from '../../models/api-feature';
import {
  PLACE_DELETE_REQUEST,
  PLACE_DETAIL,
  PLACE_FORM_OPTIONS,
  PLACE_OFFER_ITEMS,
  PLACE_ROW,
  PLACE_STATUS_COUNTS,
  PLACE_STATUS_REQUEST,
  PLACE_UPDATE_FORM,
  PLACE_WRITE_FORM,
} from '../examples/place-examples';
import {
  NO_CONTENT,
  PAGED_ENVELOPE_FIELDS,
  PAGED_QUERY_FIELDS,
  csvDownload,
  exportQuery,
  field,
  optionalField,
  pagedExample,
  PLAN_TIER,
} from '../shared-fields';
import {
  PLACE_DETAIL_FIELDS,
  PLACE_ROW_FIELDS,
  PLACE_STATUS,
  PLACE_WRITE_FIELDS,
} from './place-fields';

const PLACE_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS.slice(0, 3),
  optionalField(
    'sort',
    'enum: newest | oldest | rating | name',
    'rating: highest first. The others as in the shared rules.',
  ),
  optionalField('status', PLACE_STATUS),
  optionalField('categoryId', 'string', 'Main category id; also matches its sub categories.'),
  optionalField('planTier', PLAN_TIER),
];

export const PLACES_FEATURE: ApiFeature = {
  id: 'places',
  name: 'Places',
  screen: '/places',
  permissionModule: 'places',
  intro:
    'The core entity: a business on the map. List, status counts, detail page, bulk status and delete, CSV export, and the seven-part create/edit form saved in one request.',
  endpoints: [
    {
      id: 'places-list',
      method: 'GET',
      path: '/places',
      summary: 'The paged places table.',
      queryParams: PLACE_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page of places.',
        example: pagedExample([PLACE_ROW], 412),
        fields: [
          ...PAGED_ENVELOPE_FIELDS,
          ...PLACE_ROW_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
    },
    {
      id: 'places-status-counts',
      method: 'GET',
      path: '/places/status-counts',
      summary: 'The numbers on the status tabs above the table.',
      response: {
        status: 200,
        description: 'Counts over the whole table. They ignore the current filters.',
        example: PLACE_STATUS_COUNTS,
        fields: [field('all / active / suspended / pending', 'integer')],
      },
    },
    {
      id: 'places-detail',
      method: 'GET',
      path: '/places/{id}',
      summary: 'The full place page. The edit form loads from it too.',
      response: {
        status: 200,
        description: 'The place with every nested block.',
        example: PLACE_DETAIL,
        fields: PLACE_DETAIL_FIELDS,
      },
      notes: ['The edit form loads from this response, so every reference carries its id.'],
    },
    {
      id: 'places-bulk-status',
      method: 'PATCH',
      path: '/places/status',
      summary: 'Activate or suspend one or many places (row menu and bulk bar).',
      body: {
        contentType: 'application/json',
        fields: [
          field('ids', 'string[]', '1 to 100 ids.'),
          field('status', 'enum: active | suspended'),
        ],
        example: PLACE_STATUS_REQUEST,
      },
      response: NO_CONTENT,
      notes: ['No id in the path: this acts on the collection. The table reloads after.'],
    },
    {
      id: 'places-bulk-delete',
      method: 'POST',
      path: '/places/delete',
      summary: 'Delete one or many places.',
      permission: 'places:delete',
      body: {
        contentType: 'application/json',
        fields: [field('ids', 'string[]', '1 to 100 ids.')],
        example: PLACE_DELETE_REQUEST,
      },
      response: NO_CONTENT,
      notes: [
        'POST, because a DELETE cannot carry the id list. The dashboard only deletes through this bulk call.',
        'Soft delete (deleted_at) so reviews, payments and subscriptions keep their place.',
      ],
    },
    {
      id: 'places-export',
      method: 'GET',
      path: '/places/export',
      summary: 'Download the filtered table as CSV.',
      queryParams: [
        ...exportQuery(PLACE_FILTER_FIELDS),
        optionalField(
          'ids[]',
          'string[] (repeated field)',
          'When present, export only these rows and ignore the filters.',
        ),
      ],
      response: csvDownload('place'),
      notes: ['Send Content-Disposition: attachment. UTF-8 with a BOM so Excel shows Arabic.'],
    },
    {
      id: 'places-create',
      method: 'POST',
      path: '/places',
      summary: 'Create a place from the seven-part form, in one request.',
      body: {
        contentType: 'multipart/form-data',
        fields: PLACE_WRITE_FIELDS,
        example: PLACE_WRITE_FORM,
      },
      response: {
        status: 201,
        description: 'The new place, shaped like GET /places/{id}.',
        example: PLACE_DETAIL,
      },
      notes: [
        'Save everything in one transaction, so a half-saved place is impossible. Also creates the first subscription on planId.',
        'Enforce the package limits on images, videos and products on the server and return 422. The form checks them too, but must not be the only guard.',
      ],
    },
    {
      id: 'places-update',
      method: 'PUT',
      path: '/places/{id}',
      summary: 'Update a place from the same form.',
      body: {
        contentType: 'multipart/form-data',
        fields: [
          ...PLACE_WRITE_FIELDS,
          optionalField(
            'keptImageIds[]',
            'string[]',
            'Ids of saved photos to keep. Every saved photo not listed is deleted.',
          ),
          optionalField('keptVideoIds[]', 'string[]', 'The same for videos.'),
          field(
            'isLogoRemoved',
            'boolean',
            'true: delete the saved logo. false with no new logo: keep it.',
          ),
          optionalField(
            'products[n][id]',
            'string',
            'Set for a saved product, left out for a new one. Delete saved products not sent.',
          ),
        ],
        example: PLACE_UPDATE_FORM,
      },
      response: {
        status: 200,
        description: 'The updated place, shaped like GET /places/{id}.',
        example: PLACE_DETAIL,
      },
      notes: [
        'PHP does not read multipart bodies on PUT. Parse the body yourself (for example in a middleware).',
      ],
    },
    {
      id: 'places-form-options',
      method: 'GET',
      path: '/places/form-options',
      summary: 'The dropdowns of the place form: categories, governorates with areas, plans.',
      response: {
        status: 200,
        description: 'Active entries only, sorted as they should show.',
        example: PLACE_FORM_OPTIONS,
        fields: [
          field('mainCategories[]', 'object', '{ id, name, subCategories: [{ id, name }] }'),
          field('governorates[]', 'object', '{ id, name, areas: [{ id, name }] }'),
          field('plans[]', 'object', '{ id, name, tier }'),
        ],
      },
    },
    {
      id: 'places-offer-items',
      method: 'GET',
      path: '/places/{id}/offer-items',
      summary: 'One place\'s products, for the offer form\'s "selected items" picker.',
      permission: 'offers:view',
      response: {
        status: 200,
        description: 'Every product of the place, not paged.',
        example: PLACE_OFFER_ITEMS,
        fields: [
          field('id', 'string'),
          field('name', 'string'),
          field('price', 'number'),
          field('currency', 'enum: SYP | USD'),
        ],
      },
    },
  ],
};
