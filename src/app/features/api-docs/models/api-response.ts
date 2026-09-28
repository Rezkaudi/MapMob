import { ApiField } from './api-field';

export interface ApiResponse {
  readonly status: number;
  readonly description: string;
  /** Left out for JSON. */
  readonly contentType?: string;
  /** Left out when the body is empty or a file. */
  readonly example?: unknown;
  readonly fields?: readonly ApiField[];
}
