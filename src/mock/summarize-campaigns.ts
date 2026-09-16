import { CampaignStatus } from '../app/shared/models/campaign-status';
import { CampaignSummary } from '../app/shared/models/campaign-summary';

const ENDED_STATUSES: readonly CampaignStatus[] = ['expired', 'paused'];

interface CampaignEntry {
  readonly status: CampaignStatus;
}

export function summarizeCampaigns(entries: readonly CampaignEntry[]): CampaignSummary {
  const countWith = (statuses: readonly CampaignStatus[]) =>
    entries.filter((entry) => statuses.includes(entry.status)).length;
  return {
    totalCount: entries.length,
    activeCount: countWith(['active']),
    scheduledCount: countWith(['scheduled']),
    endedCount: countWith(ENDED_STATUSES),
  };
}
