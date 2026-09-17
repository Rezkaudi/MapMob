import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { AudienceEstimate } from '../models/audience-estimate';

export interface AudienceEstimateLabels {
  readonly count: string;
  readonly share: string;
}

export function buildAudienceEstimateLabels(estimate: AudienceEstimate): AudienceEstimateLabels {
  return {
    count: `الجمهور المقدر: ${formatGroupedNumber(estimate.deviceCount)} جهاز نشط`,
    share: `يمثل حوالي ${estimate.sharePercent}% من إجمالي قاعدة المشتركين`,
  };
}
