import { ApiFeature } from '../../models/api-feature';
import { OWNER_OVERVIEW, OWNER_PERFORMANCE } from '../examples/owner-examples';
import { field } from '../shared-fields';

const OWNER_ONLY = 'The owner of the signed-in account; scoped to their own place.';

export const OWNER_OVERVIEW_FEATURE: ApiFeature = {
  id: 'owner-overview',
  name: 'Place owner home',
  screen: '/merchant/dashboard',
  permissionModule: null,
  intro:
    "The owner's landing screen: four numbers for the last 30 days, the newest activity, the two newest reviews, their package and a views chart. All read-only and all about the owner's own place.",
  endpoints: [
    {
      id: 'owner-overview-summary',
      method: 'GET',
      path: '/owner/overview',
      summary: 'Everything on the owner home except the chart.',
      permission: OWNER_ONLY,
      response: {
        status: 200,
        description: 'One object for the whole screen.',
        example: OWNER_OVERVIEW,
        fields: [
          field('placeName', 'string', 'Greets the owner: "مرحباً <placeName>".'),
          field(
            'stats.viewCount / stats.searchAppearanceCount',
            'integer',
            'user_activities of type view / search for this place, last 30 days.',
          ),
          field(
            'stats.viewChangePercent / stats.searchAppearanceChangePercent',
            'integer',
            'Change against the 30 days before, rounded. Negative when it fell; 0 when there was nothing before.',
          ),
          field('stats.favoriteCount', 'integer', 'Users who have the place in favorites now.'),
          field('stats.averageRating', 'number', '0–5, one decimal, over visible reviews.'),
          field('stats.reviewCount', 'integer', 'Visible reviews, all time.'),
          field('activities', 'object[]', 'The 4 newest owner_inbox_items, newest first.'),
          field('activities[].kind', 'enum: review | offer | alert', 'Picks the colour and icon.'),
          field('activities[].message', 'string', 'Arabic text, shown as is.'),
          field('activities[].occurredAt', 'datetime (ISO 8601)'),
          field('latestReviews', 'object[]', 'The 2 newest visible reviews, newest first.'),
          field('latestReviews[].authorName', 'string'),
          field('latestReviews[].rating', 'integer', '1–5.'),
          field('latestReviews[].comment', 'string'),
          field('latestReviews[].createdAt', 'datetime (ISO 8601)'),
          field(
            'subscription',
            'object | null',
            'The running subscription; null when there is none.',
          ),
          field('subscription.plan', 'object', '{ id, name }'),
          field(
            'subscription.startsOn / subscription.endsOn',
            'date (yyyy-mm-dd)',
            'Both inclusive.',
          ),
          field('subscription.features', 'string[]', 'Arabic lines from plan_features, in order.'),
        ],
      },
      notes: [
        'The dashboard works out "تم استهلاك 57%" and "متبقي 158 يوماً" from startsOn, endsOn and today.',
      ],
    },
    {
      id: 'owner-overview-performance',
      method: 'GET',
      path: '/owner/overview/performance',
      summary: 'The "أداء المتجر والمشاهدات" chart for one tab.',
      permission: OWNER_ONLY,
      queryParams: [
        field(
          'period',
          'enum: weekly | monthly | yearly',
          'weekly: the last 7 days; monthly: the 12 months of this year; yearly: the last 5 years.',
        ),
      ],
      response: {
        status: 200,
        description: 'Views of the place per bucket, plus the two numbers under the chart.',
        example: OWNER_PERFORMANCE,
        fields: [
          field('points', 'object[]', 'Oldest first, one per bucket, 0 for an empty bucket.'),
          field(
            'points[].label',
            'string',
            'Axis text: Mon…Sun, Jan…Dec or the year, in English as the design draws it.',
          ),
          field('points[].value', 'integer', 'user_activities of type view in the bucket.'),
          field('dailyAverageViewCount', 'integer', 'Views in the period ÷ its days, rounded.'),
          field(
            'peakDay',
            'object | null',
            'The day with the most views; null when there were none.',
          ),
          field('peakDay.on', 'date (yyyy-mm-dd)'),
          field('peakDay.viewCount', 'integer'),
        ],
      },
    },
  ],
};
