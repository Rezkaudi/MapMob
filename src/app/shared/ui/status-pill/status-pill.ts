import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ActivationStatus } from '../../models/activation-status';

const STATUS_BACKGROUND: Record<ActivationStatus, string> = {
  active: 'bg-status-success',
  suspended: 'bg-closed',
};

@Component({
  selector: 'app-status-pill',
  templateUrl: './status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatusPill {
  readonly status = input.required<ActivationStatus>();
  /** Each feature words the status its own way, e.g. "معطلة" for a region, "معطل" for a category. */
  readonly label = input.required<string>();

  protected readonly background = computed(() => STATUS_BACKGROUND[this.status()]);
}
