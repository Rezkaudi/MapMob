import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { MediaCountTile } from '../../models/media-count-tile';
import { MediaKind } from '../../models/media-kind';

interface KindSkin {
  readonly icon: string;
  readonly tile: string;
}

const KIND_SKINS: Record<MediaKind, KindSkin> = {
  image: { icon: 'media', tile: 'bg-primary-tint text-primary' },
  video: { icon: 'video', tile: 'bg-accent/16 text-accent' },
};

/** The "توزيع الوسائط" card beside the usage card: a tile per kind and the plan limit. */
@Component({
  selector: 'app-media-distribution-card',
  imports: [AppIcon],
  templateUrl: './media-distribution-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaDistributionCard {
  readonly tiles = input.required<readonly MediaCountTile[]>();
  readonly limitText = input.required<string>();

  protected readonly skins = KIND_SKINS;
}
