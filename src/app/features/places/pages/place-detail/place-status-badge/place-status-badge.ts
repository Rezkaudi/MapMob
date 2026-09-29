import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { PLACE_STATUS_LABEL, PlaceStatus } from '../../../models/place-status';

const STATUS_BACKGROUND: Record<PlaceStatus, string> = {
  active: 'bg-status-success',
  suspended: 'bg-closed',
  pending: 'bg-status-warning',
};

/** The solid status pill beside the address in the place page header. */
@Component({
  selector: 'app-place-status-badge',
  templateUrl: './place-status-badge.html',
  host: { class: 'inline-flex' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceStatusBadge {
  readonly status = input.required<PlaceStatus>();

  protected readonly label = computed(() => PLACE_STATUS_LABEL[this.status()]);
  protected readonly background = computed(() => STATUS_BACKGROUND[this.status()]);
}
