import { Ad } from './ad';
import { AdConfirmAction } from './ad-confirm-action';

export interface AdConfirmRequest {
  readonly action: AdConfirmAction;
  readonly ad: Ad;
}
