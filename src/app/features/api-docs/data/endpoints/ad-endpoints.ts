import { ApiFeature } from '../../models/api-feature';
import {
  AD_DETAIL,
  AD_FORM,
  AD_FORM_OPTIONS,
  AD_ROW,
  CAMPAIGN_SUMMARY,
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

const PLACEMENT = 'enum: home | searchResults | categories | placeDetails';
const POSITION = 'enum: topBanner | middleBanner | bottomBanner';

const AD_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('status', CAMPAIGN_STATUS),
  optionalField('contentType', 'enum: image | video'),
  optionalField('advertiserType', 'enum: place | admin'),
  optionalField('placement', PLACEMENT),
  ...RUNNING_RANGE_FIELDS,
];

const AD_ROW_FIELDS = [
  field('id / title', 'string'),
  field(
    'advertiserType',
    'enum: place | admin',
    'place: a business paid for it. admin: the platform runs it.',
  ),
  field('place', 'object | null', '{ id, name }. null when advertiserType is admin.'),
  field('contentType', 'enum: image | video'),
  field('placement', PLACEMENT),
  field('position', POSITION),
  field('priority', 'integer 1-5', '5 shows first.'),
  field('startsOn', 'date (yyyy-mm-dd)'),
  field('endsOn', 'date (yyyy-mm-dd) | null', 'null: never ends.'),
  field('status', CAMPAIGN_STATUS),
];

const AD_FORM_FIELDS = [
  field('title', 'string', 'Max 120.'),
  field('advertiserType', 'enum: place | admin'),
  optionalField(
    'placeId',
    'string',
    'Required when advertiserType is place; must be left out for admin.',
  ),
  field('contentType', 'enum: image | video'),
  field('text', 'string', 'Banner text. Max 300.'),
  field('placement', PLACEMENT),
  field('position', POSITION),
  field('startsOn', 'date (yyyy-mm-dd)'),
  optionalField(
    'endsOn',
    'date (yyyy-mm-dd)',
    'Left out for an ad that never ends. On or after startsOn.',
  ),
  field('priority', 'integer', '1 to 5.'),
  field('status', SAVED_CAMPAIGN_STATUS),
  optionalField(
    'media',
    'file',
    'Image (png, jpg, webp; max 5 MB) or video (mp4; max 50 MB), matching contentType. Required on create unless status is draft.',
  ),
  field('isMediaRemoved', 'boolean'),
];

export const ADS_FEATURE: ApiFeature = {
  id: 'ads',
  name: 'Ads',
  screen: '/admin/ads',
  // The role matrix has no ads row yet, so ads share the offers permissions.
  permissionModule: 'offers',
  intro:
    'Banner campaigns shown around the app. A near twin of offers, plus placement, position, priority and performance metrics.',
  endpoints: [
    {
      id: 'ads-list',
      method: 'GET',
      path: '/ads',
      summary: 'The paged ads table.',
      queryParams: AD_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([AD_ROW], 31),
        fields: AD_ROW_FIELDS,
      },
      notes: CAMPAIGN_STATUS_RULES,
    },
    {
      id: 'ads-summary',
      method: 'GET',
      path: '/ads/summary',
      summary: 'The four cards above the ads table.',
      response: {
        status: 200,
        description: 'Same shape as /offers/summary.',
        example: { ...CAMPAIGN_SUMMARY, totalCount: 31 },
        fields: CAMPAIGN_SUMMARY_FIELDS,
      },
    },
    {
      id: 'ads-detail',
      method: 'GET',
      path: '/ads/{id}',
      summary: 'The ad page: text, media, audit fields and metrics.',
      response: {
        status: 200,
        description: 'The row fields plus the detail fields, all at the top level.',
        example: AD_DETAIL,
        fields: [
          field('(row fields)', '', 'As in the list row.'),
          field('text', 'string'),
          field('mediaUrl', 'string (url) | null'),
          field(
            'metrics',
            'object',
            '{ impressions, clicks, uniqueUsers } since the ad started. The dashboard works out the click rate.',
          ),
          field('createdAt / updatedAt', 'datetime (ISO 8601)'),
          field('updatedBy', 'object | null', '{ id, name } of the admin who last changed it.'),
        ],
      },
      notes: [
        'impressions and clicks are counted from ad_events; uniqueUsers counts distinct users (devices for visitors).',
      ],
    },
    {
      id: 'ads-pause',
      method: 'POST',
      path: '/ads/{id}/pause',
      summary: 'Pause an ad.',
      permission: 'offers:edit',
      response: {
        status: 200,
        description: 'The row, now paused.',
        example: { ...AD_ROW, status: 'paused' },
      },
      errors: [NOT_PAUSABLE],
      notes: [EMPTY_BODY_NOTE],
    },
    {
      id: 'ads-resume',
      method: 'POST',
      path: '/ads/{id}/resume',
      summary: 'Resume a paused ad.',
      permission: 'offers:edit',
      response: {
        status: 200,
        description: 'The row, status worked out again from its dates.',
        example: AD_ROW,
      },
      errors: [NOT_PAUSED],
      notes: [EMPTY_BODY_NOTE],
    },
    {
      id: 'ads-form-options',
      method: 'GET',
      path: '/ads/form-options',
      summary: 'The place dropdown of the ad form.',
      response: {
        status: 200,
        description: 'Active places.',
        example: AD_FORM_OPTIONS,
        fields: [field('places[]', 'object', '{ id, name }')],
      },
    },
    {
      id: 'ads-create',
      method: 'POST',
      path: '/ads',
      summary: 'Create an ad.',
      body: { contentType: 'multipart/form-data', fields: AD_FORM_FIELDS, example: AD_FORM },
      response: {
        status: 201,
        description: 'The new ad, in the detail shape.',
        example: AD_DETAIL,
      },
      notes: ['Exactly one media file per ad, matching contentType.'],
    },
    {
      id: 'ads-update',
      method: 'PUT',
      path: '/ads/{id}',
      summary: 'Update an ad.',
      body: { contentType: 'multipart/form-data', fields: AD_FORM_FIELDS, example: AD_FORM },
      response: {
        status: 200,
        description: 'The updated ad, in the detail shape.',
        example: AD_DETAIL,
      },
    },
    {
      id: 'ads-delete',
      method: 'DELETE',
      path: '/ads/{id}',
      summary: 'Delete an ad.',
      response: NO_CONTENT,
    },
    {
      id: 'ads-export',
      method: 'GET',
      path: '/ads/export',
      summary: 'Download the filtered ads as CSV.',
      queryParams: exportQuery(AD_FILTER_FIELDS),
      response: csvDownload('ad'),
    },
  ],
};
