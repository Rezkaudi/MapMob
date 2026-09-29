import { ApiFeature } from '../../models/api-feature';
import {
  OWNER_REVIEW_REPORT,
  OWNER_REVIEW_REPORTED,
  OWNER_REVIEW_ROW,
  OWNER_REVIEW_SUMMARY,
} from '../examples/owner-review-examples';
import {
  PAGED_QUERY_FIELDS,
  dayRangeFields,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';

const OWNER_ONLY = 'The owner of the signed-in account; scoped to reviews of their own place.';
const REPORT_STATUS = 'enum: none | pending | accepted | rejected';
const REPORT_REASON = 'enum: abusive | fake | unrelated | promotional | other';

export const OWNER_REVIEWS_FEATURE: ApiFeature = {
  id: 'owner-reviews',
  name: 'Place owner reviews',
  screen: '/merchant/reviews',
  permissionModule: null,
  intro:
    "The owner reads the reviews of their own place, sees how the stars spread, and reports a review they think is abusive or false. A report goes to the admins' review queue; the owner can only follow its status.",
  endpoints: [
    {
      id: 'owner-reviews-list',
      method: 'GET',
      path: '/owner/reviews',
      summary: "The paged reviews table of the signed-in owner's place.",
      permission: OWNER_ONLY,
      queryParams: [
        ...PAGED_QUERY_FIELDS,
        optionalField('rating', 'integer 1-5', 'Exactly this many stars.'),
        optionalField('reportStatus', REPORT_STATUS),
        ...dayRangeFields('submittedFrom', 'submittedTo', 'of submission'),
      ],
      response: {
        status: 200,
        description: 'One page. search matches the author name; sort name sorts by it.',
        example: pagedExample([OWNER_REVIEW_ROW], 128),
        fields: [
          field('author', 'object', '{ id, name } of the app user who wrote it.'),
          field('rating', 'integer 1-5 | null', 'null for a comment without stars.'),
          field('comment', 'string', 'The whole text; the table cuts it to two lines.'),
          field('createdAt', 'datetime (ISO 8601)'),
          field(
            'reportStatus',
            REPORT_STATUS,
            "This owner's own report on the review: none = never reported, pending = review_reports.status open, accepted / rejected = how the admin settled it.",
          ),
        ],
      },
      notes: [
        "Include reviews an admin hid after accepting this owner's report (reportStatus accepted); leave out reviews hidden for any other reason.",
      ],
    },
    {
      id: 'owner-reviews-summary',
      method: 'GET',
      path: '/owner/reviews/summary',
      summary: 'The card above the table: score, star bars and this month.',
      permission: OWNER_ONLY,
      response: {
        status: 200,
        description: "Counts over every published review of the owner's place.",
        example: OWNER_REVIEW_SUMMARY,
        fields: [
          field('averageRating', 'number', 'Mean of rated reviews only, one decimal. 0 when none.'),
          field(
            'ratedCount',
            'integer',
            'Reviews that carry stars. Shown as "بناءً على 128 تقييماً موثقاً".',
          ),
          field(
            'starCounts[]',
            'object[]',
            '{ stars, count } for 5, 4, 3, 2 and 1 stars, always all five, in that order. The screen works out each share.',
          ),
          field('thisMonthCount', 'integer', 'Reviews, rated or not, created this calendar month.'),
          field(
            'lastMonthCount',
            'integer',
            'The same for the calendar month before. The screen shows the change as "+12%", and hides it when this is 0.',
          ),
        ],
      },
    },
    {
      id: 'owner-reviews-report',
      method: 'POST',
      path: '/owner/reviews/{id}/report',
      summary: 'Report one review from the "الإبلاغ عن مراجعة" dialog.',
      permission: OWNER_ONLY,
      body: {
        contentType: 'application/json',
        fields: [
          field('reason', REPORT_REASON, 'Saved in review_reports.reason.'),
          field('notes', 'string | null', 'Up to 500 letters. null when left empty.'),
        ],
        example: OWNER_REVIEW_REPORT,
      },
      response: {
        status: 201,
        description: 'The review, shaped like one row of GET /owner/reviews, now pending.',
        example: OWNER_REVIEW_REPORTED,
      },
      errors: [
        {
          status: 404,
          when: 'The review does not exist or is on another place.',
          example: { message: 'Review not found.' },
        },
        {
          status: 409,
          when: 'This owner already reported the review.',
          example: { message: 'This review was already reported.' },
        },
        {
          status: 422,
          when: 'reason is missing or unknown, or notes is longer than 500 letters.',
          example: { message: 'The reason field is required.' },
        },
      ],
      notes: [
        "Add a review_reports row with reporter_place_id = the owner's place and status open, and set reviews.status to reported so the admin queue shows it.",
        'One report per place and review: the screen hides the report action once reportStatus is not none, but the server must still refuse with 409.',
      ],
    },
  ],
};
