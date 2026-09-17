import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { ShareBarTone } from '../../../shared/ui/share-bar/share-bar-tone';
import { GovernorateActivity } from '../models/governorate-activity';
import { ShareRow } from '../models/share-row';
import { formatShareText } from './share-text';
import { pickToneInOrder } from './tone-in-order';

const VISIT_WORD = 'زيارة';
const GOVERNORATE_TONES: readonly ShareBarTone[] = ['violet', 'blue', 'green', 'amber', 'red'];

export function toGovernorateActivityRows(
  activities: readonly GovernorateActivity[],
): readonly ShareRow[] {
  return activities.map((activity, index) => ({
    label: activity.governorateName,
    valueText: `${formatGroupedNumber(activity.visitCount)} ${VISIT_WORD}`,
    shareText: formatShareText(activity.share),
    share: activity.share,
    tone: pickToneInOrder(GOVERNORATE_TONES, index),
  }));
}
