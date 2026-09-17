import { formatGroupedNumber } from '../../../shared/formatting/grouped-number';
import { ShareBarTone } from '../../../shared/ui/share-bar/share-bar-tone';
import { ShareRow } from '../models/share-row';
import { UsageMetric } from '../models/usage-metric';
import { formatShareText } from './share-text';
import { pickToneInOrder } from './tone-in-order';

const USAGE_METRIC_TONES: readonly ShareBarTone[] = ['blue', 'green', 'amber', 'red'];

export function toUsageMetricRows(metrics: readonly UsageMetric[]): readonly ShareRow[] {
  return metrics.map((metric, index) => ({
    label: metric.label,
    valueText: formatGroupedNumber(metric.count),
    shareText: formatShareText(metric.share),
    share: metric.share,
    tone: pickToneInOrder(USAGE_METRIC_TONES, index),
  }));
}
