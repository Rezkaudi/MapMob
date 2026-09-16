import { CampaignSummary } from '../../../shared/models/campaign-summary';
import {
  CampaignStatCard,
  CampaignStatLabels,
  buildCampaignStatCards,
} from '../../../shared/state/campaign-stat-cards';

const AD_STAT_LABELS: CampaignStatLabels = {
  total: 'إجمالي الإعلانات',
  active: 'الإعلانات النشطة حالياً',
  scheduled: 'إعلانات مجدولة وقادمة',
  ended: 'إعلانات منتهية ومتوقفة',
  totalIcon: 'ads',
};

export function buildAdStatCards(summary: CampaignSummary | null): readonly CampaignStatCard[] {
  return buildCampaignStatCards(summary, AD_STAT_LABELS);
}
