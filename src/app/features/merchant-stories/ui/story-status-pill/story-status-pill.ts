import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { StoryStatus } from '../../models/story-status';

interface PillSkin {
  readonly pill: string;
  readonly hasHistoryIcon: boolean;
}

const SKINS: Record<StoryStatus, PillSkin> = {
  active: {
    pill: 'bg-status-success text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]',
    hasHistoryIcon: false,
  },
  expired: {
    pill: 'bg-[#e0e3e5] text-text-primary shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]',
    hasHistoryIcon: true,
  },
};

/** The "نشطة" or "منتهية" pill drawn over a story picture. */
@Component({
  selector: 'app-story-status-pill',
  imports: [AppIcon],
  templateUrl: './story-status-pill.html',
  host: { class: 'inline-flex' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryStatusPill {
  readonly status = input.required<StoryStatus>();
  readonly label = input.required<string>();

  protected readonly skin = computed(() => SKINS[this.status()]);
}
