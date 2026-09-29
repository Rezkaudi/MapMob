import { countEndpoints } from '../state/count-endpoints';
import { pathParamNames } from '../state/path-params';
import { API_FEATURES } from './api-features';
import { MAPMOB_API_REFERENCE } from './api-reference';
import { DATABASE_DOMAINS } from './database-domains';

const endpoints = API_FEATURES.flatMap((feature) => feature.endpoints);
const tables = DATABASE_DOMAINS.flatMap((domain) => domain.tables);

interface ExampleValue {
  readonly endpointId: string;
  readonly key: string;
  readonly value: unknown;
}

/** Every key and value inside every request and response example, however deep. */
function exampleValues(): ExampleValue[] {
  const found: ExampleValue[] = [];
  const walk = (endpointId: string, value: unknown, key: string) => {
    found.push({ endpointId, key, value });
    if (Array.isArray(value)) {
      value.forEach((item) => walk(endpointId, item, key));
    } else if (value && typeof value === 'object') {
      Object.entries(value).forEach(([childKey, child]) => walk(endpointId, child, childKey));
    }
  };
  for (const endpoint of endpoints) {
    walk(endpoint.id, endpoint.body?.example, '');
    walk(endpoint.id, endpoint.response.example, '');
  }
  return found;
}

const MOMENT = /^\d{4}-\d\d-\d\dT\d\d:\d\d:\d\d(Z|[+-]\d\d:\d\d)$/;
const DAY = /^\d{4}-\d\d-\d\d$/;

describe('the API reference data', () => {
  it('lists every call the dashboard makes, the three the place form needs, and me/logout', () => {
    expect(countEndpoints(API_FEATURES).total).toBe(170);
  });

  it('lists the thirty-three calls of the place owner area', () => {
    const ownerPaths = endpoints
      .filter((endpoint) => endpoint.path.startsWith('/owner/'))
      .map((endpoint) => `${endpoint.method} ${endpoint.path}`);

    expect(ownerPaths).toEqual([
      'POST /owner/auth/login',
      'POST /owner/auth/password/forgot',
      'POST /owner/auth/password/verify-code',
      'POST /owner/auth/password/reset',
      'GET /owner/overview',
      'GET /owner/overview/performance',
      'GET /owner/place',
      'PUT /owner/place',
      'GET /owner/products',
      'POST /owner/products',
      'PUT /owner/products/{id}',
      'DELETE /owner/products/{id}',
      'GET /owner/offers',
      'GET /owner/offers/{id}',
      'POST /owner/offers',
      'PUT /owner/offers/{id}',
      'POST /owner/offers/{id}/pause',
      'POST /owner/offers/{id}/resume',
      'DELETE /owner/offers/{id}',
      'GET /owner/media',
      'POST /owner/media',
      'PUT /owner/media/{id}',
      'DELETE /owner/media/{id}',
      'GET /owner/reviews',
      'GET /owner/reviews/summary',
      'POST /owner/reviews/{id}/report',
      'GET /owner/subscription',
      'POST /owner/subscription/requests',
      'GET /owner/notifications',
      'PATCH /owner/notifications/{id}/read',
      'GET /owner/account',
      'PUT /owner/account',
      'PUT /owner/account/password',
    ]);
  });

  it('gives every endpoint and feature its own anchor', () => {
    const anchors = [
      ...API_FEATURES.map((feature) => feature.id),
      ...endpoints.map((endpoint) => endpoint.id),
    ];

    expect(new Set(anchors).size).toBe(anchors.length);
  });

  it('never gives two parts of the page the same anchor', () => {
    const pageSections = [
      'overview',
      'conventions',
      'endpoints',
      'database',
      'build-order',
      'open-questions',
      'export',
    ];
    const anchors = [
      ...pageSections,
      ...MAPMOB_API_REFERENCE.conventions.map((section) => section.id),
      ...API_FEATURES.map((feature) => feature.id),
      ...endpoints.map((endpoint) => endpoint.id),
      ...DATABASE_DOMAINS.map((domain) => domain.id),
      'db-whole',
    ];

    expect(anchors.filter((anchor, index) => anchors.indexOf(anchor) !== index)).toEqual([]);
  });

  it('never lists the same method and path twice', () => {
    const routes = endpoints.map((endpoint) => `${endpoint.method} ${endpoint.path}`);

    expect(new Set(routes).size).toBe(routes.length);
  });

  it('gives no body to a GET or a DELETE', () => {
    const readsAndDeletes = endpoints.filter(
      (one) => one.method === 'GET' || one.method === 'DELETE',
    );

    expect(readsAndDeletes.filter((endpoint) => endpoint.body).map((one) => one.id)).toEqual([]);
  });

  it('describes exactly the path names of each endpoint', () => {
    for (const endpoint of endpoints.filter((one) => one.pathParams)) {
      expect(endpoint.pathParams?.map((param) => param.name)).toEqual(
        pathParamNames(endpoint.path),
      );
    }
  });

  it('shows an example for every response that has a body', () => {
    const silent = endpoints.filter(
      (endpoint) =>
        endpoint.response.status !== 204 &&
        !endpoint.response.contentType &&
        endpoint.response.example === undefined,
    );

    expect(silent.map((endpoint) => endpoint.id)).toEqual([]);
  });

  it('points every key column at a real table and column', () => {
    const columnsByTable = new Map(
      tables.map((table) => [table.name, table.columns.map((column) => column.name)]),
    );
    const broken = tables.flatMap((table) =>
      table.columns
        .filter((column) => column.references)
        .filter((column) => {
          const [tableName, columnName] = (column.references ?? '').split('.');
          return !columnsByTable.get(tableName)?.includes(columnName);
        })
        .map((column) => `${table.name}.${column.name}`),
    );

    expect(broken).toEqual([]);
  });

  it('draws every table in exactly one diagram slot', () => {
    for (const domain of DATABASE_DOMAINS) {
      const drawn = domain.layout.flat();

      expect([...drawn].sort()).toEqual(domain.tables.map((table) => table.name).sort());
    }
  });

  it('draws every table exactly once in the complete ERD', () => {
    const drawn = MAPMOB_API_REFERENCE.wholeErdLayout.flat();

    expect([...drawn].sort()).toEqual(tables.map((table) => table.name).sort());
  });

  it('never defines the same table twice', () => {
    const names = tables.map((table) => table.name);

    expect(new Set(names).size).toBe(names.length);
  });

  it('describes only what to build, never the old backend', () => {
    // Screens are frontend routes, and the admin ones really live under /admin.
    const text = JSON.stringify(MAPMOB_API_REFERENCE, (key, value) =>
      key === 'screen' ? undefined : value,
    );

    expect(text).not.toMatch(
      /None of|not built|neither built|Postman|[^a-z]_method|live API|[Ll]ive name|[Ll]ive today|exists today|existingRoute|admin\/stores|admin\/regions|admin\/cities|admin\/reports/,
    );
  });

  it('sends null for a missing value, never an empty string', () => {
    const empty = exampleValues().filter((one) => one.value === '');

    expect(empty.map((one) => `${one.endpointId}.${one.key}`)).toEqual([]);
  });

  it('writes every ...At as an ISO moment and every ...On as a day', () => {
    const wrong = exampleValues().filter(
      ({ key, value }) =>
        value !== null &&
        ((/At$/.test(key) && !MOMENT.test(String(value))) ||
          (/On$/.test(key) && !DAY.test(String(value)))),
    );

    expect(wrong.map((one) => `${one.endpointId}.${one.key}=${String(one.value)}`)).toEqual([]);
  });

  it('names every percentage ...Percent', () => {
    const shares = exampleValues().filter(({ key }) => /share$/i.test(key));

    expect(shares.map((one) => `${one.endpointId}.${one.key}`)).toEqual([]);
  });

  it('calls a business a place and the top tier featured, everywhere', () => {
    // A screen is a frontend route: the owner area really lives under /merchant.
    const text = JSON.stringify([API_FEATURES, DATABASE_DOMAINS], (key, value) =>
      key === 'screen' ? undefined : value,
    );

    expect(text.match(/.{40}(company|merchant|premium).{20}/i)?.[0] ?? null).toBeNull();
  });

  it('never pages an export', () => {
    const paged = endpoints.filter(
      (endpoint) =>
        endpoint.path.endsWith('/export') &&
        endpoint.queryParams?.some(
          (param) => param.name === 'pageIndex' || param.name === 'pageSize',
        ),
    );

    expect(paged.map((endpoint) => endpoint.id)).toEqual([]);
  });

  it('names every multipart array field with []', () => {
    const plainArrays = endpoints
      .filter((endpoint) => endpoint.body?.contentType === 'multipart/form-data')
      .flatMap((endpoint) =>
        Object.entries(endpoint.body?.example as Record<string, unknown>)
          .filter(([key, value]) => Array.isArray(value) && !key.endsWith('[]'))
          .map(([key]) => `${endpoint.id}.${key}`),
      );

    expect(plainArrays).toEqual([]);
  });
});
