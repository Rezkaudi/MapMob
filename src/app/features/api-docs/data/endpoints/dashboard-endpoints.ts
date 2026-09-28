import { ApiFeature } from '../../models/api-feature';
import {
  ACTION_ITEMS,
  DASHBOARD_SUMMARY,
  GROWTH_SERIES,
  RECENT_PLACES,
  REVENUE_SERIES,
} from '../examples/dashboard-examples';
import { MONEY_NOTE, PERIOD_QUERY_FIELDS, SERIES_FIELDS, field } from '../shared-fields';
import { PLACE_ROW_FIELDS } from './place-fields';

export const DASHBOARD_FEATURE: ApiFeature = {
  id: 'dashboard',
  name: 'Dashboard (home)',
  screen: '/dashboard',
  permissionModule: 'home',
  intro:
    'The landing screen: six headline numbers, a "needs your attention" list, the newest places and two charts. All read-only.',
  endpoints: [
    {
      id: 'dashboard-summary',
      method: 'GET',
      path: '/dashboard/summary',
      summary: 'The six numbers across the top of the home screen.',
      response: {
        status: 200,
        description: 'The headline numbers.',
        example: DASHBOARD_SUMMARY,
        fields: [
          field(
            'revenue',
            'object',
            '{ amount, currency }: completed payments this calendar month.',
          ),
          field('pendingPlaceCount', 'integer', 'Places waiting for approval (status pending).'),
          field('placeCount / userCount', 'integer', 'All time.'),
          field('newPlaceCount / newUserCount', 'integer', 'This calendar month, Damascus time.'),
        ],
      },
      notes: [MONEY_NOTE],
    },
    {
      id: 'dashboard-action-items',
      method: 'GET',
      path: '/dashboard/action-items',
      summary: 'The "needs your attention" list.',
      response: {
        status: 200,
        description: 'Rows in the order to show them. Rows with count 0 are left out.',
        example: ACTION_ITEMS,
        fields: [
          field('id', 'string', 'A stable key, e.g. places-pending.'),
          field('label', 'string', 'Arabic text, shown as is.'),
          field('count', 'integer'),
          field('tone', 'enum: error | warning | info | success', 'Colours the row.'),
        ],
      },
    },
    {
      id: 'dashboard-recent-places',
      method: 'GET',
      path: '/dashboard/recent-places',
      summary: 'The newest places table. Not paged.',
      response: {
        status: 200,
        description: 'The 8 newest places, newest first, in the same shape as a GET /places row.',
        example: RECENT_PLACES,
        fields: PLACE_ROW_FIELDS,
      },
    },
    {
      id: 'dashboard-revenue',
      method: 'GET',
      path: '/dashboard/revenue',
      summary: 'The revenue chart. One series.',
      queryParams: PERIOD_QUERY_FIELDS,
      response: {
        status: 200,
        description: 'One series, with its currency.',
        example: REVENUE_SERIES,
        fields: [field('currency', 'enum: SYP | USD'), ...SERIES_FIELDS],
      },
      notes: [MONEY_NOTE],
    },
    {
      id: 'dashboard-growth',
      method: 'GET',
      path: '/dashboard/growth',
      summary: 'The growth chart: new users and new places per bucket.',
      queryParams: PERIOD_QUERY_FIELDS,
      response: {
        status: 200,
        description: 'Two series with the same buckets in the same order.',
        example: GROWTH_SERIES,
        fields: SERIES_FIELDS,
      },
    },
  ],
};
