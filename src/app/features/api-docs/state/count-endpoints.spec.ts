import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { countEndpoints } from './count-endpoints';

describe('countEndpoints', () => {
  it('counts every endpoint and each method', () => {
    const features = [
      buildFeature({
        endpoints: [buildEndpoint({ method: 'GET' }), buildEndpoint({ method: 'POST' })],
      }),
      buildFeature({ endpoints: [buildEndpoint({ method: 'GET' })] }),
    ];

    expect(countEndpoints(features)).toEqual({
      total: 3,
      byMethod: { GET: 2, POST: 1, PUT: 0, PATCH: 0, DELETE: 0 },
    });
  });

  it('counts nothing in an empty list', () => {
    expect(countEndpoints([]).total).toBe(0);
  });
});
