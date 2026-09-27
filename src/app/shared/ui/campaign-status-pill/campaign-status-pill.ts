import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CAMPAIGN_STATUS_LABEL, CampaignStatus } from '../../models/campaign-status';

/** Solid in the tables, outlined with a dot on the ad detail page. */
export type CampaignStatusAppearance = 'solid' | 'outlined';

/** Active, scheduled and paused come from the design; expired and draft take quieter shades. */
const SOLID_SKIN: Record<CampaignStatus, string> = {
  active: 'bg-status-success',
  scheduled: 'bg-[#94a3b8]',
  paused: 'bg-status-error',
  expired: 'bg-text-secondary',
  draft: 'bg-status-warning',
};

/** The ad design draws the active pill; the rest take the same tint of their own colour. */
const OUTLINED_SKIN: Record<CampaignStatus, string> = {
  active: 'bg-[#ecfdf5] border-status-success text-status-success',
  scheduled: 'bg-[#f1f5f9] border-[#94a3b8] text-[#94a3b8]',
  paused: 'bg-[#fef2f2] border-status-error text-status-error',
  expired: 'bg-surface-muted border-text-secondary text-text-secondary',
  draft: 'bg-[#fffbeb] border-status-warning text-status-warning',
};

const SOLID_CLASSES = 'px-3 py-1 text-[12px]/[18px] text-white';
const OUTLINED_CLASSES = 'gap-1.5 border px-2.5 py-1 text-[12px]/[16px] font-bold';

@Component({
  selector: 'app-campaign-status-pill',
  templateUrl: './campaign-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CampaignStatusPill {
  readonly status = input.required<CampaignStatus>();
  readonly appearance = input<CampaignStatusAppearance>('solid');

  protected readonly label = computed(() => CAMPAIGN_STATUS_LABEL[this.status()]);
  protected readonly isOutlined = computed(() => this.appearance() === 'outlined');
  protected readonly skin = computed(() =>
    this.isOutlined()
      ? `${OUTLINED_SKIN[this.status()]} ${OUTLINED_CLASSES}`
      : `${SOLID_SKIN[this.status()]} ${SOLID_CLASSES}`,
  );
}
