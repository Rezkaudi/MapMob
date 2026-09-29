import { ApiFeature } from '../../models/api-feature';
import {
  NEW_PAYMENT,
  PAYMENT_DETAIL,
  PAYMENT_FORM_OPTIONS,
  PAYMENT_ROW,
  PAYMENT_SUMMARY,
} from '../examples/billing-examples';
import {
  MONEY_NOTE,
  PAGED_QUERY_FIELDS,
  csvDownload,
  dayRangeFields,
  exportQuery,
  field,
  optionalField,
  pagedExample,
} from '../shared-fields';

const PAYMENT_FILTER_FIELDS = [
  ...PAGED_QUERY_FIELDS,
  optionalField('placeName', 'string', 'Part of the place name.'),
  optionalField('paymentMethod', 'enum: cash | other'),
  optionalField('currency', 'enum: SYP | USD'),
  optionalField('status', 'enum: pending | completed'),
  ...dayRangeFields('paidFrom', 'paidTo', 'of payment'),
];

const PAYMENT_ROW_FIELDS = [
  field('transactionNumber / receiptNumber', 'string', 'Made by the server. Unique.'),
  field('place', 'object', '{ id, name }'),
  field('amount', 'number', 'In currency.'),
  field('currency', 'enum: SYP | USD'),
  field('paymentMethod', 'enum: cash | other'),
  field('status', 'enum: pending | completed'),
  field('paidOn', 'date (yyyy-mm-dd)'),
  field('notes', 'string | null'),
];

const NEW_PAYMENT_FIELDS = [
  field('placeId', 'string', 'The paying place.'),
  field(
    'kind',
    'enum: new | upgrade | renewal',
    'new: no running subscription. upgrade: a higher tier than now. renewal: the current plan.',
  ),
  field('planId', 'string', 'An active plan.'),
  field('term', 'enum: monthly | yearly', 'yearly only when the plan has a yearly price.'),
  field('amount', 'number', 'Greater than 0. May differ from the list price (discount).'),
  field('currency', 'enum: SYP | USD'),
  field('paidOn', 'date (yyyy-mm-dd)', 'Not in the future.'),
  field(
    'startsOn',
    'date (yyyy-mm-dd)',
    'Start of the paid period. The server sets endsOn from the term.',
  ),
  optionalField('notes', 'string', 'Max 500.'),
];

export const PAYMENTS_FEATURE: ApiFeature = {
  id: 'payments',
  name: 'Payments',
  app: 'admin',
  screen: '/admin/payments',
  permissionModule: 'payments',
  intro: 'Money received, and a dialog to record a cash payment.',
  endpoints: [
    {
      id: 'payments-list',
      method: 'GET',
      path: '/payments',
      summary: 'The paged payments table.',
      queryParams: PAYMENT_FILTER_FIELDS,
      response: {
        status: 200,
        description: 'One page, newest first.',
        example: pagedExample([PAYMENT_ROW], 512),
        fields: PAYMENT_ROW_FIELDS,
      },
    },
    {
      id: 'payments-summary',
      method: 'GET',
      path: '/payments/summary',
      summary: 'The four cards above the payments table.',
      response: {
        status: 200,
        description: 'Counts and totals over the whole table.',
        example: PAYMENT_SUMMARY,
        fields: [
          field('pendingCount / completedCount', 'integer'),
          field(
            'monthTotal',
            'object',
            '{ amount, currency }: completed payments this calendar month.',
          ),
          field('allTimeTotal', 'object', '{ amount, currency }: all completed payments.'),
        ],
      },
      notes: [MONEY_NOTE],
    },
    {
      id: 'payments-detail',
      method: 'GET',
      path: '/payments/{id}',
      summary: 'One payment with its place and the subscription period it paid for.',
      response: {
        status: 200,
        description: 'The row fields at the top level, plus the detail fields.',
        example: PAYMENT_DETAIL,
        fields: [
          field('kind', 'enum: new | upgrade | renewal'),
          field('place', 'object', '{ id, name, categoryName, ownerName | null, ownerPhone }'),
          field(
            'subscription',
            'object | null',
            '{ id, plan { id, name, tier }, term, startsOn, endsOn }',
          ),
          field(
            'recordedBy',
            'object | null',
            '{ id, name } of the admin; null for payments not entered by hand.',
          ),
          field('createdAt', 'datetime (ISO 8601)'),
        ],
      },
    },
    {
      id: 'payments-form-options',
      method: 'GET',
      path: '/payments/form-options',
      summary: 'The place and plan dropdowns of the new payment dialog.',
      response: {
        status: 200,
        description: 'Active places and active plans.',
        example: PAYMENT_FORM_OPTIONS,
        fields: [
          field(
            'places[]',
            'object',
            '{ id, name, currentSubscription { planId, planName, tier, endsOn } | null, currency }',
          ),
          field(
            'plans[]',
            'object',
            '{ id, name, tier, monthlyPrice, yearlyPrice | null, currency }',
          ),
        ],
      },
    },
    {
      id: 'payments-create',
      method: 'POST',
      path: '/payments',
      summary: 'Record a cash payment by hand.',
      permission: 'payments:add',
      body: { contentType: 'application/json', fields: NEW_PAYMENT_FIELDS, example: NEW_PAYMENT },
      response: {
        status: 201,
        description: 'The new payment, in the detail shape.',
        example: PAYMENT_DETAIL,
      },
      errors: [
        {
          status: 409,
          when: 'The same Idempotency-Key was already used with a different body.',
          example: { message: 'This idempotency key was used for another payment.' },
        },
      ],
      notes: [
        'Send an Idempotency-Key header (a UUID the dialog makes once). A repeat with the same key and body returns the first payment instead of recording it twice.',
        "In one transaction: store the payment as completed with method cash, store its exchange rate to the platform currency, then create (new), replace (upgrade) or extend (renewal) the place's subscription.",
        "kind must match the place's subscription: new only without a running one, renewal only on the same plan, upgrade only to a higher tier. Otherwise 422.",
      ],
    },
    {
      id: 'payments-export',
      method: 'GET',
      path: '/payments/export',
      summary: 'Download the filtered payments as CSV.',
      queryParams: exportQuery(PAYMENT_FILTER_FIELDS),
      response: csvDownload('payment'),
    },
  ],
};
