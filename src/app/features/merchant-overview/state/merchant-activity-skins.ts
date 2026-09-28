import { MerchantActivityKind } from '../models/merchant-activity-kind';

export interface MerchantActivitySkin {
  readonly icon: string;
  readonly rowClass: string;
  readonly tileClass: string;
}

export const MERCHANT_ACTIVITY_SKINS: Record<MerchantActivityKind, MerchantActivitySkin> = {
  review: { icon: 'star-feather', rowClass: 'bg-[#ffb95f]/20', tileClass: 'bg-[#ffb564]' },
  offer: { icon: 'tag-feather', rowClass: 'bg-[#2291ee]/20', tileClass: 'bg-[#2291ee]' },
  alert: { icon: 'star-feather', rowClass: 'bg-[#ffdad6]/30', tileClass: 'bg-[#ff8174]' },
};
