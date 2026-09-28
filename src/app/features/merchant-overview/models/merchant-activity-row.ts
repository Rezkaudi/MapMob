import { MerchantActivitySkin } from '../state/merchant-activity-skins';
import { MerchantActivity } from './merchant-activity';

export interface MerchantActivityRow extends MerchantActivity {
  readonly skin: MerchantActivitySkin;
}
