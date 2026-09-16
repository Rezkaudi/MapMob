import { CampaignSummary } from '../../../shared/models/campaign-summary';
import {
  CampaignStatCard,
  CampaignStatLabels,
  buildCampaignStatCards,
} from '../../../shared/state/campaign-stat-cards';

const OFFER_STAT_LABELS: CampaignStatLabels = {
  total: 'إجمالي العروض',
  active: 'العروض النشطة حالياً',
  scheduled: 'عروض مجدولة وقادمة',
  ended: 'عروض منتهية ومتوقفة',
  totalIcon: 'offers',
};

export function buildOfferStatCards(summary: CampaignSummary | null): readonly CampaignStatCard[] {
  return buildCampaignStatCards(summary, OFFER_STAT_LABELS);
}
