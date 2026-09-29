import { ApiApp } from './api-app';
import { ApiEndpoint } from './api-endpoint';

export interface ApiFeature {
  readonly id: string;
  readonly name: string;
  readonly app: ApiApp;
  /** The frontend screen that calls these endpoints. */
  readonly screen: string;
  /** The permission module the endpoints check; `null` when any signed-in admin may call them. */
  readonly permissionModule: string | null;
  readonly intro: string;
  readonly endpoints: readonly ApiEndpoint[];
}
