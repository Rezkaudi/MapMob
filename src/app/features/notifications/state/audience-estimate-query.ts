import { AudienceEstimateQuery } from '../models/audience-estimate';
import { NotificationFormValue } from './notification-form-group';

type EstimateFields = Pick<
  NotificationFormValue,
  'audience' | 'recipientMode' | 'governorateId' | 'areaId'
>;

/** `null` while there is nothing to estimate: recipients are not picked by place, or no governorate yet. */
export function toAudienceEstimateQuery(value: EstimateFields): AudienceEstimateQuery | null {
  if (value.recipientMode !== 'location' || !value.governorateId) {
    return null;
  }
  return { audience: value.audience, governorateId: value.governorateId, areaId: value.areaId };
}
