import { ApiFeature } from '../../models/api-feature';
import {
  COMPLAINT_DETAIL,
  COMPLAINT_REVIEW,
  COMPLAINT_ROW,
  COMPLAINT_SUMMARY,
} from '../examples/complaint-examples';
import {
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  csvDownload,
  exportQuery,
  dayRangeFields,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';

const COMPLAINT_STATUS = 'enum: new | inReview | resolved | rejected';

const COMPLAINT_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('status', COMPLAINT_STATUS),
  ...dayRangeFields('reportedFrom', 'reportedTo', 'of the report'),
];

export const COMPLAINTS_FEATURE: ApiFeature = {
  id: 'complaints',
  name: 'Complaints',
  screen: '/complaints',
  permissionModule: 'complaints',
  intro: 'Reports users file against a place, and what the admin decides on each.',
  endpoints: [
    {
      id: 'complaints-list',
      method: 'GET',
      path: '/complaints',
      summary: 'The paged complaints table.',
      queryParams: COMPLAINT_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page, newest first.',
        example: pagedExample([COMPLAINT_ROW], 63),
        fields: [
          field('reference', 'string', 'Shown as is, e.g. "#1023".'),
          field(
            'reason',
            'enum: wrongInformation | closedPlace | inappropriateContent | fakeReview | other',
            'A fixed code, not free text.',
          ),
          field('status', COMPLAINT_STATUS),
          field('reportedAt', 'datetime (ISO 8601)'),
          field('reporter', 'object', '{ id, name, email | null, phone | null }'),
          field(
            'place',
            'object',
            '{ id, code, name, categoryName, address, rating, reviewCount, imageUrl | null }',
          ),
        ],
      },
    },
    {
      id: 'complaints-summary',
      method: 'GET',
      path: '/complaints/summary',
      summary: 'The five cards above the complaints table.',
      response: {
        status: 200,
        description: 'Counts over the whole table.',
        example: COMPLAINT_SUMMARY,
      },
    },
    {
      id: 'complaints-detail',
      method: 'GET',
      path: '/complaints/{id}',
      summary: "One complaint with its text, photos and the admin's notes.",
      response: {
        status: 200,
        description: 'The row fields at the top level, plus four more.',
        example: COMPLAINT_DETAIL,
        fields: [
          field('description', 'string', "The reporter's one-line summary."),
          field('userDetails', 'string', "The reporter's longer text."),
          field('attachmentUrls', 'string[] (url)', 'Photos the user attached.'),
          field('adminNotes', 'string | null'),
        ],
      },
    },
    {
      id: 'complaints-review',
      method: 'PATCH',
      path: '/complaints/{id}',
      summary: "Save the admin's decision.",
      body: {
        contentType: 'application/json',
        fields: [
          field('status', COMPLAINT_STATUS),
          field('adminNotes', 'string | null', 'Max 2000. null clears it.'),
        ],
        example: COMPLAINT_REVIEW,
      },
      response: {
        status: 200,
        description: 'The updated complaint, in the detail shape.',
        example: { ...COMPLAINT_DETAIL, ...COMPLAINT_REVIEW },
      },
    },
    {
      id: 'complaints-delete',
      method: 'DELETE',
      path: '/complaints/{id}',
      summary: 'Delete a complaint.',
      response: NO_CONTENT,
    },
    {
      id: 'complaints-export',
      method: 'GET',
      path: '/complaints/export',
      summary: 'Download the filtered complaints as CSV.',
      queryParams: exportQuery(COMPLAINT_FILTER_FIELDS),
      response: csvDownload('complaint'),
    },
  ],
};
