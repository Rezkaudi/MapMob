import { ApiFeature } from '../../models/api-feature';
import { REVIEW_DETAIL, REVIEW_ROW, REVIEW_SUMMARY } from '../examples/review-examples';
import {
  EMPTY_BODY_NOTE,
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  csvDownload,
  exportQuery,
  dayRangeFields,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';

const REVIEW_STATUS = 'enum: published | reported | hidden';

const REVIEW_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField(
    'rating',
    'enum: fiveStars | fourStarsAndUp | threeStars | twoStars | oneStar | unrated',
    'Named buckets: fourStarsAndUp is 4 or 5; unrated is rating null.',
  ),
  optionalField('status', REVIEW_STATUS),
  optionalField('placeName', 'string', 'Part of a place name.'),
  ...dayRangeFields('submittedFrom', 'submittedTo', 'of submission'),
];

const NO_OPEN_REPORT = {
  status: 409,
  when: 'The review has no open report.',
  example: { message: 'This review has no open report.' },
};

export const REVIEWS_FEATURE: ApiFeature = {
  id: 'reviews',
  name: 'Reviews',
  screen: '/admin/reviews',
  permissionModule: 'reviews',
  intro: 'Stars and comments on places, and the queue of reviews users reported.',
  endpoints: [
    {
      id: 'reviews-list',
      method: 'GET',
      path: '/reviews',
      summary: 'The paged reviews table.',
      queryParams: REVIEW_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([REVIEW_ROW], 1284),
        fields: [
          field('user / place', 'object', '{ id, name }'),
          field('comment', 'string'),
          field('rating', 'integer 1-5 | null', 'null for a comment without stars.'),
          field('createdAt', 'datetime (ISO 8601)'),
          field('status', REVIEW_STATUS),
        ],
      },
    },
    {
      id: 'reviews-summary',
      method: 'GET',
      path: '/reviews/summary',
      summary: 'The four cards above the reviews table.',
      response: {
        status: 200,
        description: 'Counts over the whole table.',
        example: REVIEW_SUMMARY,
        fields: [
          field('averageRating', 'number', 'Mean of rated reviews only, one decimal. 0 when none.'),
          field('newCount', 'integer', 'This calendar month.'),
          field('totalCount / reportedCount', 'integer'),
        ],
      },
    },
    {
      id: 'reviews-detail',
      method: 'GET',
      path: '/reviews/{id}',
      summary: 'One review with its place, its author and the open report.',
      response: {
        status: 200,
        description: 'The review and three blocks.',
        example: REVIEW_DETAIL,
        fields: [
          field('(row fields)', '', 'As in the list row, at the top level.'),
          field('place', 'object', '{ id, code, name, categoryName, governorateName, areaName }'),
          field('user', 'object', '{ id, name, createdAt, reviewCount, isPhoneVerified }'),
          field(
            'openReports',
            'object[]',
            '{ id, reporter { type: user | place, id, name }, reason, notes | null, createdAt }. [] when none is open.',
          ),
        ],
      },
    },
    {
      id: 'reviews-accept-report',
      method: 'POST',
      path: '/reviews/{id}/report/accept',
      summary: 'The reporter was right: hide the review.',
      permission: 'reviews:edit',
      response: {
        status: 200,
        description: 'The review row, now hidden.',
        example: { ...REVIEW_ROW, status: 'hidden' },
      },
      errors: [NO_OPEN_REPORT],
      notes: [EMPTY_BODY_NOTE, "Closes every open report and updates the place's rating average."],
    },
    {
      id: 'reviews-reject-report',
      method: 'POST',
      path: '/reviews/{id}/report/reject',
      summary: 'The review is fine: publish it again.',
      permission: 'reviews:edit',
      response: {
        status: 200,
        description: 'The review row, now published.',
        example: { ...REVIEW_ROW, status: 'published' },
      },
      errors: [NO_OPEN_REPORT],
      notes: [EMPTY_BODY_NOTE],
    },
    {
      id: 'reviews-status',
      method: 'PATCH',
      path: '/reviews/{id}/status',
      summary: 'Hide or publish a review directly.',
      body: {
        contentType: 'application/json',
        fields: [
          field(
            'status',
            'enum: published | hidden',
            '"reported" is set by users, never by an admin.',
          ),
        ],
        example: { status: 'hidden' },
      },
      response: {
        status: 200,
        description: 'The updated review row.',
        example: { ...REVIEW_ROW, status: 'hidden' },
      },
    },
    {
      id: 'reviews-delete',
      method: 'DELETE',
      path: '/reviews/{id}',
      summary: 'Delete a review for good.',
      response: NO_CONTENT,
      notes: ["Update the place's rating average and review count."],
    },
    {
      id: 'reviews-export',
      method: 'GET',
      path: '/reviews/export',
      summary: 'Download the filtered reviews as CSV.',
      queryParams: exportQuery(REVIEW_FILTER_FIELDS),
      response: csvDownload('review'),
    },
  ],
};
