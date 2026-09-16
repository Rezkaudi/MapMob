import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CAMPAIGN_STATUS_LABEL, CampaignStatus } from '../../models/campaign-status';

/** Active, scheduled and paused come from the design; expired and draft take quieter shades. */
const STATUS_BACKGROUND: Record<CampaignStatus, string> = {
  active: 'bg-status-success',
  scheduled: 'bg-[#94a3b8]',
  paused: 'bg-status-error',
  expired: 'bg-text-secondary',
  draft: 'bg-status-warning',
};

@Component({
  selector: 'app-campaign-status-pill',
  templateUrl: './campaign-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignStatusPill {
  readonly status = input.required<CampaignStatus>();

  protected readonly label = computed(() => CAMPAIGN_STATUS_LABEL[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUND[this.status()]);
}
