import { HttpMethod } from '../models/http-method';

export interface EndpointCounts {
  readonly total: number;
  readonly byMethod: Record<HttpMethod, number>;
}
