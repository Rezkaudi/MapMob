import { ApiField } from './api-field';
import { RequestContentType } from './request-content-type';

export interface ApiRequestBody {
  readonly contentType: RequestContentType;
  readonly fields: readonly ApiField[];
  /** For multipart bodies, each key is one form field. */
  readonly example: unknown;
}
