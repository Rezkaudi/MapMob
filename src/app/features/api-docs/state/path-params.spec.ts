import { buildEndpoint } from '../testing/api-docs-fixture';
import { pathParamNames, pathParamsFor } from './path-params';

describe('pathParamNames', () => {
  it('finds nothing in a path without braces', () => {
    expect(pathParamNames('/places')).toEqual([]);
  });

  it('finds every name in order', () => {
    expect(pathParamNames('/governorates/{governorateId}/areas/{id}')).toEqual([
      'governorateId',
      'id',
    ]);
  });
});

describe('pathParamsFor', () => {
  it('describes each path name as a required string', () => {
    const endpoint = buildEndpoint({ path: '/places/{id}' });

    expect(pathParamsFor(endpoint)).toEqual([
      { name: 'id', type: 'string', isRequired: true, description: 'The record id.' },
    ]);
  });

  it('keeps the descriptions an endpoint writes itself', () => {
    const own = { name: 'kind', type: 'enum', isRequired: true, description: 'terms | privacy' };
    const endpoint = buildEndpoint({ path: '/content/pages/{kind}', pathParams: [own] });

    expect(pathParamsFor(endpoint)).toEqual([own]);
  });
});
