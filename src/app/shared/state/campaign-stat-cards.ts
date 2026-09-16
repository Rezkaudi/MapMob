import { CampaignSummary } from '../models/campaign-summary';

const NUMBER_FORMAT = new Intl.NumberFormat('en-US');
const ACTIVE_ICON = 'check-circle-outline';
const SCHEDULED_ICON = 'time-circle';
const ENDED_ICON = 'offer-ended';

/** The words each feature puts on its four cards, and its own icon for the total. */
export interface CampaignStatLabels {
  readonly total: string;
  readonly active: string;
  readonly scheduled: string;
  readonly ended: string;
  readonly totalIcon: string;
}

export interface CampaignStatCard {
  readonly label: string;
  readonly value: string;
  readonly icon: string;
}

function card(label: string, count: number | undefined, icon: string): CampaignStatCard {
  return { label, value: NUMBER_FORMAT.format(count ?? 0), icon };
}

/** RTL puts the first card on the right, so the total leads. */
export function buildCampaignStatCards(
  summary: CampaignSummary | null,
  labels: CampaignStatLabels,
): readonly CampaignStatCard[] {
  return [
    card(labels.total, summary?.totalCount, labels.totalIcon),
    card(labels.active, summary?.activeCount, ACTIVE_ICON),
    card(labels.scheduled, summary?.scheduledCount, SCHEDULED_ICON),
    card(labels.ended, summary?.endedCount, ENDED_ICON),
  ];
}
