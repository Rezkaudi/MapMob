import { ApiFeature } from '../../models/api-feature';
import {
  CATEGORY_SHARES,
  GOVERNORATE_ACTIVITY,
  REPORT_REVENUE,
  USAGE_METRICS,
  USER_GROWTH,
} from '../examples/report-examples';
import { MONEY_NOTE, PERIOD_QUERY_FIELDS, SERIES_FIELDS, field } from '../shared-fields';

const PERCENT_FIELD = field('sharePercent', 'number 0-100', 'One decimal. The rows add up to 100.');
const LAST_30_DAYS = 'Counts the last 30 days.';

export const REPORTS_FEATURE: ApiFeature = {
  id: 'reports',
  name: 'Analytics reports',
  screen: '/admin/reports',
  permissionModule: 'reports',
  intro:
    'The charts screen. Read-only. /reports here means analytics; reports users file against places are complaints, under /complaints.',
  endpoints: [
    {
      id: 'reports-category-shares',
      method: 'GET',
      path: '/reports/category-shares',
      summary: 'Share of places per main category (pie chart).',
      response: {
        status: 200,
        description: 'Largest first. Active places only.',
        example: CATEGORY_SHARES,
        fields: [
          field('category', 'object', '{ id, name }'),
          field('placeCount', 'integer'),
          PERCENT_FIELD,
        ],
      },
    },
    {
      id: 'reports-governorate-activity',
      method: 'GET',
      path: '/reports/governorate-activity',
      summary: 'Place visits per governorate (bar list).',
      response: {
        status: 200,
        description: `Largest first. ${LAST_30_DAYS}`,
        example: GOVERNORATE_ACTIVITY,
        fields: [
          field('governorate', 'object', '{ id, name }'),
          field('visitCount', 'integer', 'Place views by users in that governorate.'),
          PERCENT_FIELD,
        ],
      },
    },
    {
      id: 'reports-user-growth',
      method: 'GET',
      path: '/reports/user-growth',
      summary: 'New and active users per bucket.',
      queryParams: PERIOD_QUERY_FIELDS,
      response: {
        status: 200,
        description:
          'Series newUsers (registered in the bucket) and activeUsers (seen in the bucket).',
        example: USER_GROWTH,
        fields: SERIES_FIELDS,
      },
    },
    {
      id: 'reports-usage',
      method: 'GET',
      path: '/reports/usage',
      summary: 'What users did, by kind of action, over the picked period.',
      queryParams: PERIOD_QUERY_FIELDS,
      response: {
        status: 200,
        description: 'Largest first.',
        example: USAGE_METRICS,
        fields: [
          field('key', 'enum: search | placeView | favorite | review | share', 'Stable code.'),
          field('label', 'string', 'Arabic name, shown as is.'),
          field('count', 'integer'),
          PERCENT_FIELD,
        ],
      },
    },
    {
      id: 'reports-revenue',
      method: 'GET',
      path: '/reports/revenue',
      summary: 'Revenue chart. One series.',
      queryParams: PERIOD_QUERY_FIELDS,
      response: {
        status: 200,
        description: 'Same shape as /dashboard/revenue; may share its handler.',
        example: REPORT_REVENUE,
        fields: [field('currency', 'enum: SYP | USD'), ...SERIES_FIELDS],
      },
      notes: [MONEY_NOTE],
    },
  ],
};
