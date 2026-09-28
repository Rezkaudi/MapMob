import { ApiField } from '../models/api-field';
import { ApiResponse } from '../models/api-response';

export function field(name: string, type: string, description = '', isRequired = true): ApiField {
  return { name, type, isRequired, description };
}

export function optionalField(name: string, type: string, description = ''): ApiField {
  return field(name, type, description, false);
}

export const LIST_SORT_VALUES = 'newest | oldest | name';

export const PAGED_QUERY_FIELDS: readonly ApiField[] = [
  optionalField('pageIndex', 'integer', 'Zero-based; the first page is 0. Default 0.'),
  optionalField('pageSize', 'integer', '1 to 100. Default 20. Over 100 is a 422.'),
  optionalField('search', 'string', 'Free text, case-insensitive. Left out when empty.'),
  optionalField(
    'sort',
    `enum: ${LIST_SORT_VALUES}`,
    "newest / oldest: by the row's main date. name: by its title, A to Z. Default newest.",
  ),
];

/** An export takes the same filters as its list, but always returns every matching row. */
export function exportQuery(fields: readonly ApiField[]): ApiField[] {
  return fields.filter((one) => one.name !== 'pageIndex' && one.name !== 'pageSize');
}

export const PLAN_TIER = 'enum: free | basic | featured';

/** Two inclusive calendar days, each one optional. */
export function dayRangeFields(fromName: string, toName: string, what: string): ApiField[] {
  return [
    optionalField(fromName, 'date (yyyy-mm-dd)', `First day, inclusive, ${what}.`),
    optionalField(toName, 'date (yyyy-mm-dd)', `Last day, inclusive, ${what}.`),
  ];
}

export const PERIOD_QUERY_FIELDS: readonly ApiField[] = [
  field(
    'period',
    'enum: daily | weekly | monthly | yearly',
    'Bucket size. daily: last 30 days; weekly: last 12 weeks; monthly: last 12 months; yearly: last 5 years.',
  ),
];

export const SERIES_FIELDS: readonly ApiField[] = [
  optionalField(
    'key',
    'string',
    'Stable id of the series, e.g. users. Only on multi-series charts.',
  ),
  field('name', 'string', 'Legend text, in Arabic.'),
  field('points', 'object[]', 'Oldest first, one per bucket, with 0 for an empty bucket.'),
  field(
    'points[].periodStart',
    'date (yyyy-mm-dd)',
    'First day of the bucket (Saturday for weeks). The dashboard writes the axis label.',
  ),
  field('points[].value', 'number'),
];

export const MONEY_NOTE =
  'Money totals are in the platform currency (settings: currency). Payments in another currency are counted at the rate stored on each payment.';

export const ACTIVATION_STATUS = 'enum: active | suspended';

export const STATUS_BODY_FIELDS: readonly ApiField[] = [field('status', ACTIVATION_STATUS)];

export function pagedExample<TItem>(items: readonly TItem[], totalCount: number) {
  return { items, totalCount };
}

export const PAGED_ENVELOPE_FIELDS: readonly ApiField[] = [
  field('items', 'object[]', 'This page only.'),
  field('totalCount', 'integer', 'Rows across ALL pages. Drives the pager.'),
];

export const NO_CONTENT: ApiResponse = {
  status: 204,
  description: 'Done. The body is empty.',
};

export function csvDownload(what: string): ApiResponse {
  return {
    status: 200,
    contentType: 'text/csv',
    description: `A CSV file of every ${what} that matches the filters. The file name carries the date, e.g. ${what}s-2026-09-28.csv.`,
  };
}

export const EMPTY_BODY_NOTE = 'The dashboard sends no body (null).';
