import { buildEndpoint, buildFeature } from '../testing/api-docs-fixture';
import { errorCasesFor } from './error-cases';

const feature = buildFeature({ permissionModule: 'places' });

function statusesOf(...args: Parameters<typeof errorCasesFor>): number[] {
  return errorCasesFor(...args).map((errorCase) => errorCase.status);
}

describe('errorCasesFor', () => {
  it('gives a plain read 401 and 403', () => {
    expect(statusesOf(feature, buildEndpoint())).toEqual([401, 403]);
  });

  it('adds 404 when the path names a record', () => {
    expect(statusesOf(feature, buildEndpoint({ path: '/places/{id}' }))).toEqual([401, 403, 404]);
  });

  it('adds 422 when the request has a body', () => {
    const endpoint = buildEndpoint({
      method: 'POST',
      body: { contentType: 'application/json', fields: [], example: {} },
    });

    expect(statusesOf(feature, endpoint)).toEqual([401, 403, 422]);
  });

  it("names the endpoint's own first plain body field in the 422 sample", () => {
    const endpoint = buildEndpoint({
      method: 'PATCH',
      body: {
        contentType: 'application/json',
        fields: [
          { name: 'startsOn / endsOn', type: 'date', isRequired: true, description: '' },
          { name: 'status', type: 'enum', isRequired: true, description: '' },
        ],
        example: {},
      },
    });
    const invalid = errorCasesFor(feature, endpoint).find((one) => one.status === 422);

    expect(invalid?.example).toEqual({
      message: 'The given data was invalid.',
      errors: { status: ['The status field is required.'] },
    });
  });

  it('drops 403 when any signed-in admin may call it', () => {
    expect(statusesOf(feature, buildEndpoint({ permission: null }))).toEqual([401]);
  });

  it('drops 401 and 403 on a public endpoint', () => {
    expect(statusesOf(feature, buildEndpoint({ isPublic: true }))).toEqual([]);
  });

  it('names the permission in the 403 case', () => {
    const forbidden = errorCasesFor(feature, buildEndpoint()).find((one) => one.status === 403);

    expect(forbidden?.when).toContain('places:view');
  });

  it('checks the kind of token, not a role, on an owner app call', () => {
    const ownerFeature = buildFeature({ app: 'owner', permissionModule: null });
    const forbidden = errorCasesFor(ownerFeature, buildEndpoint()).find(
      (one) => one.status === 403,
    );

    expect(forbidden?.when).toContain('admin token');
  });

  it('signs out the user of either app on 401', () => {
    const unauthenticated = errorCasesFor(feature, buildEndpoint()).find(
      (one) => one.status === 401,
    );

    expect(unauthenticated?.when).not.toContain('admin');
  });

  it('adds the cases an endpoint lists itself, in status order', () => {
    const endpoint = buildEndpoint({
      path: '/places/{id}',
      errors: [{ status: 409, when: 'Still in use.', example: { message: 'In use.' } }],
    });

    expect(statusesOf(feature, endpoint)).toEqual([401, 403, 404, 409]);
  });
});
