import { DocsSection } from '../models/docs-section';

export const API_CONVENTIONS: readonly DocsSection[] = [
  {
    id: 'convention-base-url',
    title: 'Base URL',
    paragraphs: [
      'The dashboard reads one base URL (NG_APP_API_BASE_URL) and calls every path below it. Every path in this reference is relative to it: /users means <base>/users.',
      'Keep every admin route under one prefix, for example https://api.mapmob.com.co/admin, so /users becomes https://api.mapmob.com.co/admin/users.',
    ],
  },
  {
    id: 'convention-auth',
    title: 'Authentication and permissions',
    paragraphs: [
      'Laravel Sanctum bearer tokens. POST /auth/login returns a token; every other call sends it as "Authorization: Bearer <token>". POST /auth/logout revokes it.',
      '401 when the token is missing, wrong or expired: the dashboard signs the admin out. 403 when the admin is signed in but the role lacks the permission: the dashboard stays signed in.',
      'Each endpoint names the permission it checks, as "module:action". A full-access role passes every check. Check on the server even though the dashboard hides what a role cannot do.',
    ],
    code: 'GET /places?pageIndex=0&pageSize=20\nAuthorization: Bearer 19|IMIsakH3jSYZAYYrrTvsc6rEpQX4Fad1d0nPq2Lx\nAccept: application/json\nAccept-Language: ar',
  },
  {
    id: 'convention-envelope',
    title: 'Response shape',
    paragraphs: [
      'Return the payload itself, with no wrapper such as {data: ...}. A list returns {items, totalCount}; a single record returns the object; a write returns the saved record in its detail shape; a delete returns 204 with no body.',
      'totalCount counts ALL matching rows, not just this page. The pager needs it.',
    ],
    code: '// A list\n{ "items": [ { "id": "12" } ], "totalCount": 137 }\n\n// One record\n{ "id": "12", "name": "متجر دمشق", "status": "active" }',
  },
  {
    id: 'convention-paging',
    title: 'Paging, search, sort and filters',
    paragraphs: [
      "pageIndex (zero-based, default 0) and pageSize (1 to 100, default 20). Laravel's page is one-based: page = pageIndex + 1.",
      'search is case-insensitive free text over the columns each list names. sort is newest | oldest | name (places add rating); default newest.',
      'Filters are flat query parameters and filter by id, never by display name (categoryId, not a category name). Date ranges are two inclusive calendar days, such as paidFrom and paidTo.',
    ],
  },
  {
    id: 'convention-naming',
    title: 'Names and values',
    paragraphs: [
      'camelCase JSON; snake_case columns in the database, mapped in API Resources.',
      'Ids are strings in JSON ("12", not 12). Another record is referenced as a small object, { id, name }, never as a bare name.',
      'One word per idea across the whole API: a business on the map is always a place (never a store, company or merchant). Plan tiers are always free | basic | featured.',
      "Text comes back in the admin's language (Arabic) as one plain string. Read Accept-Language; default ar.",
      'State is a word, not a flag: status is active | suspended for anything that can be switched on and off. Each field lists its allowed words.',
      'A missing value is null, never "" and never left out. Lists are [] when empty.',
      'Return data, not display text: dates, numbers and codes. The dashboard formats labels such as "منذ 3 أيام" or "01:24" itself.',
    ],
  },
  {
    id: 'convention-dates',
    title: 'Dates and times',
    paragraphs: [
      'Two shapes, told apart by the name. A field ending in At is a moment: ISO 8601 in UTC, or with the Damascus offset for times an admin picks (notification send times). A field ending in On is a calendar day: yyyy-mm-dd with no zone.',
      '"Today", "this month" and "running now" always mean Damascus time (Asia/Damascus).',
    ],
    table: {
      head: ['Shape', 'Example', 'Used for'],
      rows: [
        [
          '…At (moment)',
          '2026-09-27T18:00:00Z',
          'createdAt, updatedAt, lastActiveAt, reportedAt, receivedAt',
        ],
        ['…At picked by an admin', '2026-10-01T20:00:00+03:00', 'notification sendAt'],
        ['…On (day)', '2026-09-27', 'startsOn, endsOn, paidOn'],
      ],
    },
  },
  {
    id: 'convention-numbers',
    title: 'Money and percentages',
    paragraphs: [
      'Money is { amount, currency } or an amount beside a currency field, never formatted text: 250000 means 250,000 SYP. Currencies are SYP | USD.',
      'Totals across payments are in the platform currency. Each payment stores the exchange rate it was recorded with, so totals never add SYP to USD.',
      'Every percentage is named …Percent and runs from 0 to 100 with one decimal: 64.5 means 64.5%.',
    ],
  },
  {
    id: 'convention-verbs',
    title: 'HTTP verbs and status codes',
    paragraphs: [
      'GET reads. POST creates (201) or runs an action such as pause (200). PUT replaces a whole record (200). PATCH changes one small thing such as a status (200). DELETE removes (204).',
      'The dashboard sends real PUT, PATCH and DELETE verbs, never a method-override field.',
      'Multipart on PUT: PHP does not fill $_POST for a PUT request, so parse the body yourself (for example in a middleware).',
    ],
  },
  {
    id: 'convention-uploads',
    title: 'Files and arrays',
    paragraphs: [
      'Endpoints that carry a file use multipart/form-data; the rest use JSON. Each endpoint says which.',
      'Every file field has an isXRemoved flag (isImageRemoved, isMediaRemoved, isLogoRemoved). true: delete the saved file. false and no file: keep it.',
      'Arrays use the name[] form, e.g. itemIds[]=5&itemIds[]=9, in forms and query strings alike; PHP keeps only the last value of a plain repeated name.',
      'Return stored files as full URLs (imageUrl, logoUrl). In the cURL samples, "@file.png" means "upload this file".',
    ],
  },
  {
    id: 'convention-errors',
    title: 'Errors',
    paragraphs: [
      "Every error has a message. 422 also lists every failing field under errors, named exactly as sent. Unknown ids are 404. A clash with the record's current state (deleting a used category, editing a sent notification) is 409.",
      'Never 500 for bad input, and APP_DEBUG is off in production.',
    ],
    table: {
      head: ['Status', 'When'],
      rows: [
        ['401', 'No token, or a bad or expired token'],
        ['403', 'Signed in, but the role lacks the permission'],
        ['404', 'No record with that id'],
        ['409', "The request clashes with the record's state"],
        ['422', 'A field is missing or invalid'],
        ['429', 'Too many requests (sign-in)'],
      ],
    },
    code: '{\n  "message": "The given data was invalid.",\n  "errors": {\n    "name": ["The name field is required."],\n    "ownerPhone": ["The owner phone format is invalid."]\n  }\n}',
  },
  {
    id: 'convention-safety',
    title: 'Safe writes',
    paragraphs: [
      'Money-moving calls (POST /payments) take an Idempotency-Key header: the same key and body returns the first result instead of recording twice.',
      'A write that touches several tables (a place with its hours, media and products; a payment with its subscription) runs in one database transaction.',
      'Deleting users and places is a soft delete, so reviews, complaints and payments keep their links.',
    ],
  },
  {
    id: 'convention-csv',
    title: 'CSV exports',
    paragraphs: [
      'Every /export takes the same filters as its list, has no paging, and returns every matching row.',
      'Return the file itself (Content-Type: text/csv; charset=utf-8, Content-Disposition: attachment) with a UTF-8 BOM so Excel shows Arabic. The columns match the table on screen.',
    ],
  },
];
