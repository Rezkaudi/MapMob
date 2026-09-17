import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ContentPageStatus } from '../../models/content-page-status';

interface StatusSkin {
  readonly label: string;
  readonly background: string;
}

/** The design only draws a published page; the draft pill follows the offers' amber drafts. */
const STATUS_SKINS: Record<ContentPageStatus, StatusSkin> = {
  published: { label: 'منشورة ومتاحة', background: 'bg-status-success' },
  draft: { label: 'مسودة', background: 'bg-status-warning' },
};

@Component({
  selector: 'app-content-status-pill',
  templateUrl: './content-status-pill.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentStatusPill {
  readonly status = input.required<ContentPageStatus>();

  protected readonly skin = computed(() => STATUS_SKINS[this.status()]);
}
