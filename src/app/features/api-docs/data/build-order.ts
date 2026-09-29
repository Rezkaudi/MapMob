import { DocsTable } from '../models/docs-section';

/** Each step only needs what the steps before it built. */
export const BUILD_ORDER: DocsTable = {
  head: ['Step', 'What', 'Why this order'],
  rows: [
    [
      '0',
      'Shared rules: plain {items, totalCount}, camelCase, zero-based pageIndex, real verbs, error shapes',
      'Every endpoint uses them',
    ],
    [
      '1',
      'Sign-in, admins, roles and permissions, own account',
      'Every other call checks the token and a permission',
    ],
    [
      '2',
      'Governorates and areas, then categories',
      'Places, users, notifications and offers point at them',
    ],
    [
      '3',
      'Places: list, counts, detail, create and edit with hours, media and products, bulk status and delete, export',
      'The core entity most features hang off',
    ],
    ['4', 'App users, reviews and complaints', 'They point at users and places'],
    [
      '5',
      'Plans, subscriptions, payment methods and payments',
      'A payment creates or extends a subscription',
    ],
    ['6', 'Offers and ads, with pause/resume and ad metrics', 'They point at places and products'],
    [
      '7',
      'Push notifications, device tokens, admin inbox and alert settings',
      'They target users, places and locations',
    ],
    ['8', 'Content pages, FAQ and platform settings', 'Stand alone'],
    [
      '9',
      'Dashboard summary and charts, analytics reports',
      'Read-only totals over everything above',
    ],
    [
      '10',
      'Place owner app: owner sign-in and password reset, own place, products, offers, media, reviews, subscription requests, notifications, account, home stats',
      'Reuses the tables above, scoped to the one place of the signed-in owner',
    ],
  ],
};
