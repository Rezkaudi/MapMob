import { ApiEndpoint } from '../models/api-endpoint';
import { ApiErrorCase } from '../models/api-error-case';
import { ApiFeature } from '../models/api-feature';
import { pathParamNames } from './path-params';
import { requiredPermission } from './required-permission';

const UNAUTHENTICATED: ApiErrorCase = {
  status: 401,
  when: 'The bearer token is missing, wrong or expired. The app signs the user out.',
  example: { message: 'Unauthenticated.' },
};

const NOT_FOUND: ApiErrorCase = {
  status: 404,
  when: 'No record has the id in the path.',
  example: { message: 'Record not found.' },
};

const FALLBACK_FIELD_NAME = 'name';
/** A single field such as `status`, not a group such as `startsOn / endsOn` or `images[]`. */
const PLAIN_FIELD_NAME = /^\w+$/;

function validationFailed(endpoint: ApiEndpoint): ApiErrorCase {
  const fieldName =
    endpoint.body?.fields.find((field) => PLAIN_FIELD_NAME.test(field.name))?.name ??
    FALLBACK_FIELD_NAME;
  return {
    status: 422,
    when: 'A field is missing or invalid. Return every failing field.',
    example: {
      message: 'The given data was invalid.',
      errors: { [fieldName]: [`The ${fieldName} field is required.`] },
    },
  };
}

const WRONG_TOKEN_KIND: ApiErrorCase = {
  status: 403,
  when: 'The token is an admin token, not a place owner token. Do not sign out.',
  example: { message: 'This action is unauthorized.' },
};

function forbidden(permission: string): ApiErrorCase {
  return {
    status: 403,
    when: `The admin is signed in, but the role does not hold "${permission}". Do not sign out.`,
    example: { message: 'This action is unauthorized.' },
  };
}

/** The standard cases every endpoint of this kind can return, plus its own. */
export function errorCasesFor(feature: ApiFeature, endpoint: ApiEndpoint): ApiErrorCase[] {
  const cases: ApiErrorCase[] = [];
  const permission = requiredPermission(feature, endpoint);
  if (!endpoint.isPublic) {
    cases.push(UNAUTHENTICATED);
  }
  if (permission) {
    cases.push(forbidden(permission));
  }
  if (feature.app === 'owner' && !endpoint.isPublic) {
    cases.push(WRONG_TOKEN_KIND);
  }
  if (pathParamNames(endpoint.path).length > 0) {
    cases.push(NOT_FOUND);
  }
  if (endpoint.body) {
    cases.push(validationFailed(endpoint));
  }
  cases.push(...(endpoint.errors ?? []));
  return cases.sort((first, second) => first.status - second.status);
}
