import { ApiFeature } from '../../models/api-feature';
import {
  OWNER_PRODUCT,
  OWNER_PRODUCT_CATALOG,
  OWNER_PRODUCT_FORM,
  OWNER_PRODUCT_UPDATE_FORM,
} from '../examples/owner-examples';
import { NO_CONTENT, field, optionalField } from '../shared-fields';

const NOT_THEIR_PRODUCT = {
  status: 404,
  when: 'The product does not exist or belongs to another place.',
  example: { message: 'Product not found.' },
};

const PRODUCT_FIELDS = [
  field('id', 'string'),
  field('name', 'string'),
  field('price', 'number', 'An amount in currency, not formatted: 200 means 200 SYP.'),
  field('currency', 'enum: SYP | USD'),
  field(
    'imageUrl',
    'string (url) | null',
    "products.image_path; null draws the name's first letter.",
  ),
  field('isAvailable', 'boolean', 'Shown as "متاح" or "غير متاح".'),
  field('orderUrl', 'string (url) | null', 'An outside ordering app.'),
  field('updatedAt', 'string (ISO 8601)', 'Shown as "منذ أسبوع".'),
];

const PRODUCT_WRITE_FIELDS = [
  field('name', 'string', 'Max 120.'),
  field('price', 'number', '0 or more.'),
  field('currency', 'enum: SYP | USD'),
  field('isAvailable', 'boolean'),
  optionalField('orderUrl', 'string (url)', 'Left out when empty; store null.'),
  optionalField('image', 'file (JPG or PNG, max 5 MB)', 'Sent only when a new picture was picked.'),
];

export const OWNER_PRODUCTS_FEATURE: ApiFeature = {
  id: 'owner-products',
  name: 'Place owner products',
  app: 'owner',
  screen: '/merchant/products',
  permissionModule: null,
  intro:
    'The owner lists, adds, edits and deletes the products and services of their own place. The screen reads every product in one call and searches, sorts and counts them itself, so the list is not paged.',
  endpoints: [
    {
      id: 'owner-products-list',
      method: 'GET',
      path: '/owner/products',
      summary: "Every product of the signed-in owner's place, with the plan's product limit.",
      response: {
        status: 200,
        description: 'One object for the whole screen.',
        example: OWNER_PRODUCT_CATALOG,
        fields: [
          field('plan', 'object', '{ id, name } of the current subscription.'),
          field(
            'productLimit',
            'number | null',
            'plans.limit_products of the current plan; null = no cap.',
          ),
          field('items[]', 'object[]', 'Oldest first. The fields below.'),
          ...PRODUCT_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
    },
    {
      id: 'owner-products-create',
      method: 'POST',
      path: '/owner/products',
      summary: 'Add a product or service from the "إضافة منتج أو خدمة" dialog.',
      body: {
        contentType: 'multipart/form-data',
        fields: PRODUCT_WRITE_FIELDS,
        example: OWNER_PRODUCT_FORM,
      },
      response: {
        status: 201,
        description: 'The new product, shaped like one of items[] in GET /owner/products.',
        example: OWNER_PRODUCT,
      },
      errors: [
        {
          status: 422,
          when: 'The place already has productLimit products.',
          example: { message: 'The current plan allows no more products.' },
        },
      ],
      notes: [
        'The screen turns the add button off at the limit, but the server must still refuse with 422.',
      ],
    },
    {
      id: 'owner-products-update',
      method: 'PUT',
      path: '/owner/products/{id}',
      summary: 'Save a product changed in the same dialog.',
      body: {
        contentType: 'multipart/form-data',
        fields: [
          ...PRODUCT_WRITE_FIELDS,
          field(
            'isImageRemoved',
            'boolean',
            'true: delete the saved picture. false with no file: keep it.',
          ),
        ],
        example: OWNER_PRODUCT_UPDATE_FORM,
      },
      response: {
        status: 200,
        description: 'The saved product, with a new updatedAt.',
        example: OWNER_PRODUCT,
      },
      errors: [NOT_THEIR_PRODUCT],
      notes: [
        'The screen always sends the whole form: an orderUrl that is left out is cleared to null.',
        'PHP does not read multipart bodies on PUT. Parse the body yourself (for example in a middleware).',
      ],
    },
    {
      id: 'owner-products-delete',
      method: 'DELETE',
      path: '/owner/products/{id}',
      summary: 'Delete a product after the owner confirms.',
      response: NO_CONTENT,
      errors: [NOT_THEIR_PRODUCT],
      notes: ['Also delete its stored picture. Offers that listed it drop it from their items.'],
    },
  ],
};
