import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { REGION_STATUS_LABEL, RegionStatus } from '../../models/region-status';

const STATUS_BACKGROUND: Record<RegionStatus, string> = {
  active: 'bg-status-success',
  suspended: 'bg-closed',
};

@Component({
  selector: 'app-region-status-pill',
  templateUrl: './region-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionStatusPill {
  readonly status = input.required<RegionStatus>();

  protected readonly label = computed(() => REGION_STATUS_LABEL[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUND[this.status()]);
}
