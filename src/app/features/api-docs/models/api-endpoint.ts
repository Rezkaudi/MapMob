import { ApiErrorCase } from './api-error-case';
import { ApiField } from './api-field';
import { ApiRequestBody } from './api-request-body';
import { ApiResponse } from './api-response';
import { HttpMethod } from './http-method';

export interface ApiEndpoint {
  /** Anchor of the endpoint card, unique across the whole reference. */
  readonly id: string;
  readonly method: HttpMethod;
  /** Relative to the API base URL, with `{name}` for path parameters. */
  readonly path: string;
  readonly summary: string;
  /** Overrides the permission worked out from the method; `null` means any signed-in admin. */
  readonly permission?: string | null;
  readonly isPublic?: boolean;
  /** A filled-in path for the cURL sample, when a plain `12` for each name would be wrong. */
  readonly samplePath?: string;
  readonly pathParams?: readonly ApiField[];
  readonly queryParams?: readonly ApiField[];
  readonly body?: ApiRequestBody;
  readonly response: ApiResponse;
  /** Only the cases beyond the standard 401 / 403 / 404 / 422 set. */
  readonly errors?: readonly ApiErrorCase[];
  readonly notes?: readonly string[];
}
