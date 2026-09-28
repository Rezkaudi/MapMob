import { buildEndpoint } from '../testing/api-docs-fixture';
import { buildCurlExample } from './curl-example';

describe('buildCurlExample', () => {
  it('sends the token on a plain read', () => {
    expect(buildCurlExample(buildEndpoint({ path: '/users/summary' }))).toBe(
      'curl "$API_BASE_URL/users/summary" \\\n  -H "Authorization: Bearer $TOKEN"',
    );
  });

  it('asks for the first page of a paged list', () => {
    const endpoint = buildEndpoint({
      queryParams: [{ name: 'pageIndex', type: 'integer', isRequired: true, description: '' }],
    });

    expect(buildCurlExample(endpoint)).toContain('"$API_BASE_URL/places?pageIndex=0&pageSize=10"');
  });

  it('fills path names with a sample id', () => {
    expect(buildCurlExample(buildEndpoint({ path: '/places/{id}' }))).toContain('/places/12"');
  });

  it('uses the sample path an endpoint gives', () => {
    const endpoint = buildEndpoint({
      path: '/content/pages/{kind}',
      samplePath: '/content/pages/terms',
    });

    expect(buildCurlExample(endpoint)).toContain('"$API_BASE_URL/content/pages/terms"');
  });

  it('writes a JSON body on one line', () => {
    const endpoint = buildEndpoint({
      method: 'PATCH',
      path: '/users/{id}/status',
      body: { contentType: 'application/json', fields: [], example: { status: 'suspended' } },
    });

    expect(buildCurlExample(endpoint)).toBe(
      [
        'curl -X PATCH "$API_BASE_URL/users/12/status"',
        '-H "Authorization: Bearer $TOKEN"',
        '-H "Content-Type: application/json"',
        `-d '{"status":"suspended"}'`,
      ].join(' \\\n  '),
    );
  });

  it('escapes single quotes inside a JSON body', () => {
    const endpoint = buildEndpoint({
      method: 'POST',
      body: { contentType: 'application/json', fields: [], example: { name: "Sam's" } },
    });

    expect(buildCurlExample(endpoint)).toContain(`-d '{"name":"Sam'\\''s"}'`);
  });

  it('sends a multipart body one form field at a time', () => {
    const endpoint = buildEndpoint({
      method: 'POST',
      path: '/offers',
      body: {
        contentType: 'multipart/form-data',
        fields: [],
        example: { title: 'عرض', itemIds: ['5', '9'], image: '@offer.png', isImageRemoved: false },
      },
    });

    const curl = buildCurlExample(endpoint);

    expect(curl).toContain('-F "title=عرض"');
    expect(curl).toContain('-F "itemIds=5" \\\n  -F "itemIds=9"');
    expect(curl).toContain('-F "image=@offer.png"');
    expect(curl).toContain('-F "isImageRemoved=false"');
    expect(curl).not.toContain('Content-Type');
  });

  it('leaves the token out of a public call', () => {
    expect(buildCurlExample(buildEndpoint({ isPublic: true }))).not.toContain('Authorization');
  });

  it('saves a file download to disk', () => {
    const endpoint = buildEndpoint({
      path: '/places/export',
      response: { status: 200, description: 'CSV', contentType: 'text/csv' },
    });

    expect(buildCurlExample(endpoint)).toContain('-o export.csv');
  });
});
