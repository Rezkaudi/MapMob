import { ApiFeature } from '../../models/api-feature';
import { AREA_DRAFT, AREA_ROW, GOVERNORATE_ROW, REGION_DRAFT } from '../examples/region-examples';
import {
  ACTIVATION_STATUS,
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  STATUS_BODY_FIELDS,
  field,
  pagedExample,
} from '../shared-fields';

const REGION_ROW_FIELDS = [
  field('id', 'string'),
  field('name', 'string'),
  field('subAreaCount', 'integer', 'Governorate: its areas. Area: always 0 for now.'),
  field('placeCount', 'integer'),
  field('status', ACTIVATION_STATUS),
  field('updatedAt', 'datetime (ISO 8601)'),
];

const REGION_DRAFT_FIELDS = [
  field('name', 'string', 'Max 120. Unique in its parent.'),
  field('status', ACTIVATION_STATUS),
];

const STILL_IN_USE = {
  status: 409,
  when: 'Areas or places still point at it.',
  example: { message: 'This governorate still has 8 areas.' },
};

export const REGIONS_FEATURE: ApiFeature = {
  id: 'regions',
  name: 'Governorates and areas',
  app: 'admin',
  screen: '/admin/regions',
  permissionModule: 'regions',
  intro:
    'Governorates and the areas inside them: two levels, each with its own list, create, edit, status toggle and delete.',
  endpoints: [
    {
      id: 'governorates-list',
      method: 'GET',
      path: '/governorates',
      summary: 'The paged governorate table.',
      queryParams: PAGED_QUERY_FIELDS,
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([GOVERNORATE_ROW], 14),
        fields: REGION_ROW_FIELDS,
      },
    },
    {
      id: 'governorates-detail',
      method: 'GET',
      path: '/governorates/{id}',
      summary: 'One governorate, for the areas page header.',
      response: { status: 200, description: 'The governorate row.', example: GOVERNORATE_ROW },
    },
    {
      id: 'governorates-create',
      method: 'POST',
      path: '/governorates',
      summary: 'Create a governorate.',
      body: { contentType: 'application/json', fields: REGION_DRAFT_FIELDS, example: REGION_DRAFT },
      response: { status: 201, description: 'The new governorate.', example: GOVERNORATE_ROW },
      notes: [
        'The dashboard sends no slug or sortOrder. Make the slug on the server and default the sort order.',
      ],
    },
    {
      id: 'governorates-update',
      method: 'PUT',
      path: '/governorates/{id}',
      summary: 'Update a governorate.',
      body: { contentType: 'application/json', fields: REGION_DRAFT_FIELDS, example: REGION_DRAFT },
      response: { status: 200, description: 'The updated governorate.', example: GOVERNORATE_ROW },
    },
    {
      id: 'governorates-status',
      method: 'PATCH',
      path: '/governorates/{id}/status',
      summary: 'Toggle one governorate.',
      body: {
        contentType: 'application/json',
        fields: STATUS_BODY_FIELDS,
        example: { status: 'suspended' },
      },
      response: {
        status: 200,
        description: 'The updated governorate.',
        example: { ...GOVERNORATE_ROW, status: 'suspended' },
      },
    },
    {
      id: 'governorates-delete',
      method: 'DELETE',
      path: '/governorates/{id}',
      summary: 'Delete a governorate.',
      response: NO_CONTENT,
      errors: [STILL_IN_USE],
    },
    {
      id: 'areas-list',
      method: 'GET',
      path: '/governorates/{governorateId}/areas',
      summary: 'The paged areas of one governorate.',
      pathParams: [field('governorateId', 'string', 'The parent governorate.')],
      queryParams: PAGED_QUERY_FIELDS,
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([AREA_ROW], 8),
        fields: [field('governorateId', 'string'), ...REGION_ROW_FIELDS],
      },
    },
    {
      id: 'areas-create',
      method: 'POST',
      path: '/governorates/{governorateId}/areas',
      summary: 'Create an area in a governorate.',
      pathParams: [field('governorateId', 'string', 'The parent governorate.')],
      body: { contentType: 'application/json', fields: REGION_DRAFT_FIELDS, example: AREA_DRAFT },
      response: { status: 201, description: 'The new area.', example: AREA_ROW },
    },
    {
      id: 'areas-update',
      method: 'PUT',
      path: '/areas/{id}',
      summary: 'Update an area. Note the path is not nested.',
      body: { contentType: 'application/json', fields: REGION_DRAFT_FIELDS, example: AREA_DRAFT },
      response: { status: 200, description: 'The updated area.', example: AREA_ROW },
    },
    {
      id: 'areas-status',
      method: 'PATCH',
      path: '/areas/{id}/status',
      summary: 'Toggle one area.',
      body: {
        contentType: 'application/json',
        fields: STATUS_BODY_FIELDS,
        example: { status: 'suspended' },
      },
      response: {
        status: 200,
        description: 'The updated area.',
        example: { ...AREA_ROW, status: 'suspended' },
      },
    },
    {
      id: 'areas-delete',
      method: 'DELETE',
      path: '/areas/{id}',
      summary: 'Delete an area.',
      response: NO_CONTENT,
      errors: [
        {
          ...STILL_IN_USE,
          when: 'Places still point at it.',
          example: { message: 'This area still has 31 places.' },
        },
      ],
    },
  ],
};
