import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ContentPageStatus } from '../../models/content-page-status';

interface StatusSkin {
  readonly label: string;
  readonly background: string;
}

/** The design only draws a published page; an unpublished one is grey. */
const STATUS_SKINS: Record<ContentPageStatus, StatusSkin> = {
  published: { label: 'منشورة ومتاحة', background: 'bg-status-success' },
  unpublished: { label: 'غير منشورة', background: 'bg-[#94a3b8]' },
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
