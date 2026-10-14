import { LiveReference } from '../../../core/http/live-reference';

export interface LivePlaceFormOptions {
  readonly mainCategories: readonly (LiveReference & {
    readonly subCategories?: readonly LiveReference[];
  })[];
  readonly governorates?: readonly (LiveReference & {
    readonly areas?: readonly LiveReference[];
  })[];
  readonly deliveryPlatforms?: readonly { readonly platform: string }[];
}
