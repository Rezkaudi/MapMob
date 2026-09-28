import { ApiEndpoint } from '../models/api-endpoint';
import { ApiField } from '../models/api-field';

const PATH_PARAM_PATTERN = /\{(\w+)\}/g;
const RECORD_ID_DESCRIPTION = 'The record id.';

export function pathParamNames(path: string): string[] {
  return [...path.matchAll(PATH_PARAM_PATTERN)].map((match) => match[1]);
}

export function pathParamsFor(endpoint: ApiEndpoint): readonly ApiField[] {
  if (endpoint.pathParams) {
    return endpoint.pathParams;
  }
  return pathParamNames(endpoint.path).map((name) => ({
    name,
    type: 'string',
    isRequired: true,
    description: RECORD_ID_DESCRIPTION,
  }));
}
