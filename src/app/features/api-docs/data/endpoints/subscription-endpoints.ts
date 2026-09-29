import { ApiFeature } from '../../models/api-feature';
import {
  PACKAGE_PLAN,
  PLAN_DRAFT,
  SUBSCRIPTION_ROW,
  SUBSCRIPTION_SUMMARY,
} from '../examples/billing-examples';
import {
  ACTIVATION_STATUS,
  NO_CONTENT,
  PAGED_QUERY_FIELDS,
  PLAN_TIER,
  STATUS_BODY_FIELDS,
  csvDownload,
  dayRangeFields,
  exportQuery,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';

const SUBSCRIPTION_STATUS = 'enum: active | paused | expired';

const SUBSCRIPTION_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('tier', PLAN_TIER),
  optionalField('status', SUBSCRIPTION_STATUS),
  ...dayRangeFields('startedFrom', 'startedTo', 'of the start date'),
];

const LIMIT_KEYS = 'adsPerMonth, activeOffers, galleryImages, videos, products';

const PLAN_FIELDS = [
  field('id / name / tagline', 'string'),
  field('tier', PLAN_TIER, "The plan's identity; one plan per tier. Not editable."),
  field('badge', 'string | null', 'Pill beside the name.'),
  field('monthlyPrice', 'number'),
  field('yearlyPrice', 'number | null', 'null: no yearly option.'),
  field('currency', 'enum: SYP | USD'),
  field('subscriberCount', 'integer', 'Active subscriptions on this plan.'),
  field('limits', 'object', `{ ${LIMIT_KEYS} }, each an integer or null (no cap).`),
  field('features', 'string[]', 'Bullet points, in order.'),
  field('status', ACTIVATION_STATUS, 'A suspended plan cannot be picked for new subscriptions.'),
];

const PLAN_DRAFT_FIELDS = [
  field('name', 'string', 'Max 60.'),
  field('tagline', 'string', 'Max 120.'),
  optionalField('badge', 'string | null', 'Max 30.'),
  field('monthlyPrice', 'number', '0 or more.'),
  field('yearlyPrice', 'number | null'),
  field('currency', 'enum: SYP | USD'),
  field('limits', 'object', `{ ${LIMIT_KEYS} }: each an integer 0 or more, or null.`),
  field('features', 'string[]', 'Replaces the whole list. Up to 12, each max 160.'),
];

export const SUBSCRIPTIONS_FEATURE: ApiFeature = {
  id: 'subscriptions',
  name: 'Plans and subscriptions',
  app: 'admin',
  screen: '/admin/subscriptions',
  permissionModule: 'subscriptions',
  intro:
    'The plans the platform sells, and which place is on which plan for which period. Two tabs on one page.',
  endpoints: [
    {
      id: 'subscriptions-summary',
      method: 'GET',
      path: '/subscriptions/summary',
      summary: 'The strip of cards above the two tabs.',
      response: {
        status: 200,
        description: 'Figures over all subscriptions.',
        example: SUBSCRIPTION_SUMMARY,
        fields: [
          field(
            'topPlan',
            'object | null',
            '{ id, name, subscriberCount }: the plan with the most active subscriptions.',
          ),
          field('activePlanCount', 'integer'),
          field('endingSoonCount', 'integer', 'Active subscriptions ending in the next 7 days.'),
          field('activeSubscriberCount', 'integer'),
          field(
            'activeSubscriberPercent',
            'number 0-100',
            'Active subscriptions out of all places, one decimal.',
          ),
        ],
      },
    },
    {
      id: 'plans-list',
      method: 'GET',
      path: '/subscription-plans',
      summary: 'The plan cards on the plans tab.',
      response: {
        status: 200,
        description: 'Every plan, featured first.',
        example: [PACKAGE_PLAN],
        fields: PLAN_FIELDS,
      },
    },
    {
      id: 'plans-update',
      method: 'PUT',
      path: '/subscription-plans/{id}',
      summary: "Edit a plan's text, prices, limits and features.",
      body: { contentType: 'application/json', fields: PLAN_DRAFT_FIELDS, example: PLAN_DRAFT },
      response: { status: 200, description: 'The updated plan.', example: PACKAGE_PLAN },
      notes: ['New prices apply to new subscriptions only; running ones keep the price they paid.'],
    },
    {
      id: 'plans-status',
      method: 'PATCH',
      path: '/subscription-plans/{id}/status',
      summary: 'Turn a plan on or off.',
      body: {
        contentType: 'application/json',
        fields: STATUS_BODY_FIELDS,
        example: { status: 'suspended' },
      },
      response: {
        status: 200,
        description: 'The updated plan.',
        example: { ...PACKAGE_PLAN, status: 'suspended' },
      },
      notes: ['Running subscriptions on a suspended plan continue until they end.'],
    },
    {
      id: 'plans-delete',
      method: 'DELETE',
      path: '/subscription-plans/{id}',
      summary: 'Delete a plan that was never used.',
      response: NO_CONTENT,
      errors: [
        {
          status: 409,
          when: 'Any subscription or payment, past or present, points at the plan. Suspend it instead.',
          example: { message: 'This plan has subscription history. Suspend it instead.' },
        },
      ],
    },
    {
      id: 'subscriptions-list',
      method: 'GET',
      path: '/subscriptions',
      summary: 'The paged subscription records table.',
      queryParams: SUBSCRIPTION_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page.',
        example: pagedExample([SUBSCRIPTION_ROW], 268),
        fields: [
          field('place', 'object', '{ id, name }'),
          field('plan', 'object', '{ id, name, tier }'),
          field('term', 'enum: monthly | yearly'),
          field('price', 'number', 'What was paid for this period.'),
          field('currency', 'enum: SYP | USD'),
          field('startsOn / endsOn', 'date (yyyy-mm-dd)'),
          field('status', SUBSCRIPTION_STATUS, 'A daily job sets expired once endsOn has passed.'),
        ],
      },
    },
    {
      id: 'subscriptions-export',
      method: 'GET',
      path: '/subscriptions/export',
      summary: 'Download the filtered subscriptions as CSV.',
      queryParams: exportQuery(SUBSCRIPTION_FILTER_FIELDS),
      response: csvDownload('subscription'),
    },
  ],
};
