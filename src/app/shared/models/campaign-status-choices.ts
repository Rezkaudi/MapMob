import { ChoiceOption } from '../ui/choice-chips/choice-option';
import { CAMPAIGN_STATUS_LABEL, CampaignStatus } from './campaign-status';

const ALL_LABEL = 'الكل';
/** The ads filter design's order; "متوقف" is not in that design, so it comes last. */
const STATUS_ORDER: readonly CampaignStatus[] = [
  'active',
  'draft',
  'scheduled',
  'expired',
  'paused',
];

export const CAMPAIGN_STATUS_CHOICES: readonly ChoiceOption[] = [
  { value: null, label: ALL_LABEL },
  ...STATUS_ORDER.map((status) => ({ value: status, label: CAMPAIGN_STATUS_LABEL[status] })),
];
