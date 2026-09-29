import { ApiFeature } from '../../models/api-feature';
import {
  OWNER_PLAN_CHANGE_BODY,
  OWNER_PLAN_CHANGE_REQUEST,
  OWNER_SUBSCRIPTION,
} from '../examples/owner-subscription-examples';
import { PLAN_TIER, field } from '../shared-fields';

const OWNER_ONLY = 'The owner of the signed-in account; scoped to their own place.';
const PERIOD = 'enum: monthly | yearly';
const CHANGE_KIND = 'enum: upgrade | downgrade | renewal';

const PERIOD_FIELDS = [
  field('id', 'string'),
  field('plan', 'object', '{ id, name } of subscription_plans.'),
  field('term', PERIOD),
  field(
    'price',
    'object',
    '{ amount, currency }: what was paid for the period, 0 on the free plan.',
  ),
  field(
    'paymentMethod',
    'enum: cash | other',
    'payments.method of the payment for the period; cash when there is none.',
  ),
  field('startsOn', 'string (yyyy-mm-dd)'),
  field('endsOn', 'string (yyyy-mm-dd)'),
  field('status', 'enum: active | paused | expired'),
];

const USAGE_FIELDS = [
  field(
    'usage.products',
    'object',
    '{ used, limit }: products of the place against plans.limit_products.',
  ),
  field(
    'usage.galleryImages',
    'object',
    '{ used, limit }: pictures in place_media against limit_gallery_images.',
  ),
  field(
    'usage.activeOffers',
    'object',
    '{ used, limit }: running and scheduled offers against limit_active_offers.',
  ),
  field(
    'usage.adsThisMonth',
    'object',
    '{ used, limit }: ads started this calendar month (Damascus) against limit_ads_per_month.',
  ),
];

const PLAN_FIELDS = [
  field('plans[].id', 'string'),
  field('plans[].name', 'string'),
  field('plans[].tier', PLAN_TIER),
  field('plans[].tagline', 'string'),
  field('plans[].monthlyPrice', 'number'),
  field(
    'plans[].yearlyPrice',
    'number | null',
    'After the yearly discount; null when the tier has no yearly price.',
  ),
  field('plans[].currency', 'enum: SYP | USD'),
  field(
    'plans[].limits',
    'object',
    '{ products, galleryImages, activeOffers, adsPerMonth, videos }; each a number, null = no cap.',
  ),
  field('plans[].features', 'string[]', 'plan_features.text in sort_order.'),
];

const REQUEST_FIELDS = [
  field('id', 'string'),
  field('kind', CHANGE_KIND),
  field('plan', 'object', '{ id, name } of the plan asked for.'),
  field('term', PERIOD),
  field('status', "'pending'", 'Only waiting requests are returned; handled ones are history.'),
  field('createdAt', 'string (ISO 8601)'),
];

export const OWNER_SUBSCRIPTION_FEATURE: ApiFeature = {
  id: 'owner-subscription',
  name: 'Place owner subscription',
  screen: '/merchant/subscription',
  permissionModule: null,
  intro:
    'The owner sees the current plan, how much of each limit the place uses, the plans on sale and every past period. Payment is cash only, so the owner never pays here: upgrading, moving to a cheaper plan or renewing sends a request that MapMob reviews, and an admin records the cash payment and switches the plan.',
  endpoints: [
    {
      id: 'owner-subscription-read',
      method: 'GET',
      path: '/owner/subscription',
      summary: 'Everything the subscription screen shows, in one call.',
      permission: OWNER_ONLY,
      response: {
        status: 200,
        description: 'One object for the whole screen.',
        example: OWNER_SUBSCRIPTION,
        fields: [
          field(
            'current',
            'object',
            'The newest active subscriptions row of the place; the newest row of any status if none is active. Shaped like history[].',
          ),
          ...USAGE_FIELDS,
          field('usage.*.limit', 'number | null', 'From the current plan; null = no cap.'),
          field(
            'plans[]',
            'object[]',
            'Every active subscription_plans row, cheapest tier first (free, basic, featured).',
          ),
          ...PLAN_FIELDS,
          field(
            'history[]',
            'object[]',
            'Every subscriptions row of the place, newest startsOn first, the current one included.',
          ),
          ...PERIOD_FIELDS.map((one) => ({ ...one, name: `history[].${one.name}` })),
          field(
            'pendingRequest',
            'object | null',
            'The waiting subscription_requests row, shaped like the POST response. null when none waits.',
          ),
        ],
      },
      notes: [
        'A place always has a subscription: a new place starts on the free plan.',
        'The screen offers renewal in the last 7 days of the current period, or after it ends, and never for the free plan.',
      ],
    },
    {
      id: 'owner-subscription-request',
      method: 'POST',
      path: '/owner/subscription/requests',
      summary: 'Ask to upgrade, move to a cheaper plan, or renew, from the plan dialogs.',
      permission: OWNER_ONLY,
      body: {
        contentType: 'application/json',
        fields: [
          field(
            'kind',
            CHANGE_KIND,
            'upgrade: a dearer tier. downgrade: a cheaper tier. renewal: the current plan again.',
          ),
          field('planId', 'string', 'renewal sends the current plan.'),
          field(
            'term',
            PERIOD,
            "The billing switch on the screen; renewal sends the current period's term.",
          ),
        ],
        example: OWNER_PLAN_CHANGE_BODY,
      },
      response: {
        status: 201,
        description: 'The saved request. The screen then shows the plan as under review.',
        example: OWNER_PLAN_CHANGE_REQUEST,
        fields: REQUEST_FIELDS,
      },
      errors: [
        {
          status: 409,
          when: 'The place already has a pending request.',
          example: { message: 'A plan change request is already waiting.' },
        },
        {
          status: 422,
          when: 'planId is not an active plan, or kind does not fit it (upgrade to a cheaper tier, renewal of another plan, renewal of the free plan).',
          example: {
            message: 'The selected plan is not a higher tier.',
            errors: { planId: ['invalid'] },
          },
        },
      ],
      notes: [
        'Do not change the subscription here. An admin applies the request after the cash is paid; a downgrade starts when the current period ends.',
        'Tell the admins in their inbox (admin_inbox_items) that a request arrived.',
      ],
    },
  ],
};
