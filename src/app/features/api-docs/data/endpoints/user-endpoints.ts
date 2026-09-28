import { ApiFeature } from '../../models/api-feature';
import { USER_DETAIL, USER_ROW, USER_SUMMARY } from '../examples/user-examples';
import {
  ACTIVATION_STATUS,
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  STATUS_BODY_FIELDS,
  csvDownload,
  exportQuery,
  dayRangeFields,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';

const USER_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('accountType', 'enum: registered | visitor'),
  optionalField('status', ACTIVATION_STATUS),
  ...dayRangeFields('registeredFrom', 'registeredTo', 'of registration'),
];

const USER_ROW_FIELDS = [
  field('id', 'string'),
  field('name', 'string', 'A visitor gets a made-up name such as "زائر 1042".'),
  field('email / phone', 'string | null', 'Both may be null for a visitor.'),
  field('accountType', 'enum: registered | visitor'),
  field('governorate', 'object | null', '{ id, name }. null when unknown.'),
  field('createdAt', 'datetime (ISO 8601)', 'Registration time.'),
  field('lastActiveAt', 'datetime (ISO 8601) | null'),
  field('status', ACTIVATION_STATUS),
];

export const USERS_FEATURE: ApiFeature = {
  id: 'users',
  name: 'App users',
  screen: '/users',
  permissionModule: 'users',
  intro:
    'People using the mobile app, registered or visitors: list, summary, detail page, suspend, delete and CSV export.',
  endpoints: [
    {
      id: 'users-list',
      method: 'GET',
      path: '/users',
      summary: 'The paged users table.',
      queryParams: USER_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([USER_ROW], 9630),
        fields: USER_ROW_FIELDS,
      },
    },
    {
      id: 'users-summary',
      method: 'GET',
      path: '/users/summary',
      summary: 'The four cards above the users table.',
      response: {
        status: 200,
        description: 'Counts over the whole table.',
        example: USER_SUMMARY,
        fields: [
          field('totalUserCount / activeUserCount / suspendedUserCount', 'integer'),
          field('newUserCount', 'integer', 'This calendar month.'),
        ],
      },
    },
    {
      id: 'users-detail',
      method: 'GET',
      path: '/users/{id}',
      summary: 'The user page: the user, stats, recent activity, favourites and reviews.',
      response: {
        status: 200,
        description: 'The user plus four blocks.',
        example: USER_DETAIL,
        fields: [
          field('user', 'object', 'The list row plus isPhoneVerified.'),
          field(
            'stats',
            'object',
            '{ searchCount, viewedPlaceCount, favoritePlaceCount, reviewCount }',
          ),
          field(
            'activities[]',
            'object',
            '{ id, type: search | view | favorite | review | share, description, place { id, name } | null, occurredAt }. Latest 20.',
          ),
          field(
            'favoritePlaces[]',
            'object',
            '{ place { id, name }, category { id, name, icon, color }, governorate { id, name }, savedAt }. Latest 20.',
          ),
          field(
            'reviews[]',
            'object',
            '{ id, place { id, name }, rating 1-5 | null, comment, status, createdAt }. Latest 20.',
          ),
        ],
      },
    },
    {
      id: 'users-status',
      method: 'PATCH',
      path: '/users/{id}/status',
      summary: 'Suspend or reactivate one user.',
      body: {
        contentType: 'application/json',
        fields: STATUS_BODY_FIELDS,
        example: { status: 'suspended' },
      },
      response: {
        status: 200,
        description: 'The updated user row.',
        example: { ...USER_ROW, status: 'suspended' },
      },
      notes: ["Suspending should also revoke the user's app tokens."],
    },
    {
      id: 'users-delete',
      method: 'DELETE',
      path: '/users/{id}',
      summary: 'Delete a user account.',
      response: NO_CONTENT,
      notes: [
        'Soft delete, and blank the name, email and phone. Their reviews and complaints keep pointing at the row.',
      ],
    },
    {
      id: 'users-export',
      method: 'GET',
      path: '/users/export',
      summary: 'Download the filtered users table as CSV.',
      queryParams: exportQuery(USER_FILTER_FIELDS),
      response: csvDownload('user'),
    },
  ],
};
