import { ApiFeature } from '../../models/api-feature';
import {
  CATEGORY_DRAFT,
  CATEGORY_PAGE,
  MAIN_CATEGORIES,
  SUB_CATEGORY_ROW,
} from '../examples/category-examples';
import {
  ACTIVATION_STATUS,
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  STATUS_BODY_FIELDS,
  field,
  optionalField,
} from '../shared-fields';

const CATEGORY_COLORS =
  '#FF8104 #006F69 #FC0303 #03732B #5977FF #55B4AF #F4D400 #0583EC #0F172A #10B981 #1027B9 #4B2996 #D141DF';

const CATEGORY_FIELDS = [
  field('id', 'string'),
  field('name', 'string'),
  field('kind', 'enum: main | sub', 'Worked out from parentId.'),
  field('parentId / parentName', 'string | null', 'null on a main category.'),
  field('icon', 'string', 'A Lucide icon NAME such as utensils-crossed. Not a file.'),
  field('color', 'string (#RRGGBB)', 'One of the 13 palette colours.'),
  field('placeCount', 'integer', "Places in this category (main: its own plus its children's)."),
  field('status', ACTIVATION_STATUS),
  field('updatedAt', 'datetime (ISO 8601)'),
];

const CATEGORY_DRAFT_FIELDS = [
  field('name', 'string', 'Max 100. Unique among siblings.'),
  field(
    'parentId',
    'string | null',
    'null makes a main category; an id makes a sub category of that main category. Sub categories cannot have children.',
  ),
  optionalField(
    'status',
    'enum: active | suspended',
    'Create only. Default active; use the status endpoint later.',
  ),
  field('icon', 'string', 'A Lucide icon name from the fixed list of 60 in the dashboard.'),
  field('color', 'string', `One of: ${CATEGORY_COLORS}.`),
];

export const CATEGORIES_FEATURE: ApiFeature = {
  id: 'categories',
  name: 'Categories',
  screen: '/admin/categories',
  permissionModule: 'categories',
  intro:
    'A two-level tree: main categories and their sub categories. Each has a Lucide icon name and a colour from a fixed palette.',
  endpoints: [
    {
      id: 'categories-list',
      method: 'GET',
      path: '/categories',
      summary: 'The paged category table, plus the numbers on its three chips.',
      queryParams: [
        ...PAGED_QUERY_FIELDS,
        optionalField('kind', 'enum: main | sub'),
        optionalField('status', ACTIVATION_STATUS),
        optionalField('parentId', 'string', 'Only the children of one main category.'),
      ],
      response: {
        status: 200,
        description: 'One page, plus kindCounts.',
        example: CATEGORY_PAGE,
        fields: [
          field('items', 'object[]'),
          field('totalCount', 'integer'),
          field(
            'kindCounts',
            'object',
            '{ all, main, sub }. Counted with every filter applied except kind.',
          ),
          ...CATEGORY_FIELDS.map((one) => ({ ...one, name: `items[].${one.name}` })),
        ],
      },
      notes: ['The only list with an extra field (kindCounts) next to items and totalCount.'],
    },
    {
      id: 'categories-main',
      method: 'GET',
      path: '/categories/main',
      summary: 'Main categories only, for the parent dropdown.',
      response: {
        status: 200,
        description: 'Not paged. Sorted by name.',
        example: MAIN_CATEGORIES,
        fields: [field('id', 'string'), field('name', 'string')],
      },
    },
    {
      id: 'categories-create',
      method: 'POST',
      path: '/categories',
      summary: 'Create a category.',
      body: {
        contentType: 'application/json',
        fields: CATEGORY_DRAFT_FIELDS,
        example: CATEGORY_DRAFT,
      },
      response: {
        status: 201,
        description: 'The new category, as a list row.',
        example: SUB_CATEGORY_ROW,
      },
      notes: [
        'icon is a Lucide icon NAME (a string), not an uploaded file. The dashboard draws it in the chosen colour, so this is plain JSON.',
      ],
    },
    {
      id: 'categories-update',
      method: 'PUT',
      path: '/categories/{id}',
      summary: 'Update a category.',
      body: {
        contentType: 'application/json',
        fields: CATEGORY_DRAFT_FIELDS,
        example: CATEGORY_DRAFT,
      },
      response: { status: 200, description: 'The updated category.', example: SUB_CATEGORY_ROW },
    },
    {
      id: 'categories-status',
      method: 'PATCH',
      path: '/categories/{id}/status',
      summary: 'Toggle one category from the row menu.',
      body: {
        contentType: 'application/json',
        fields: STATUS_BODY_FIELDS,
        example: { status: 'suspended' },
      },
      response: {
        status: 200,
        description: 'The updated category.',
        example: { ...SUB_CATEGORY_ROW, status: 'suspended' },
      },
    },
    {
      id: 'categories-delete',
      method: 'DELETE',
      path: '/categories/{id}',
      summary: 'Delete a category.',
      response: NO_CONTENT,
      errors: [
        {
          status: 409,
          when: 'The category still has sub categories or places.',
          example: { message: 'This category still has 12 places. Move them first.' },
        },
      ],
      notes: ['Refuse with 409 while children or places point at it, rather than cascading.'],
    },
  ],
};
