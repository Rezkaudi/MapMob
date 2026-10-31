import { MerchantActivity } from '../models/merchant-activity';
import { MerchantActivityKind } from '../models/merchant-activity-kind';
import { LiveOwnerInteraction } from './live-owner-interaction';

export function toMerchantActivity(interaction: LiveOwnerInteraction): MerchantActivity {
  return {
    id: String(interaction.id),
    kind: activityKindOf(interaction.type ?? interaction.kind ?? ''),
    message: interaction.title ?? interaction.message ?? interaction.body ?? '',
    occurredAt: interaction.createdAt ?? interaction.created_at ?? '',
  };
}

function activityKindOf(type: string): MerchantActivityKind {
  if (type.includes('review')) {
    return 'review';
  }
  return type.includes('offer') ? 'offer' : 'alert';
}
