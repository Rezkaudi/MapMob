import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { DistributionTile, DistributionTileTone } from '../../models/distribution-tile';
import { AppIcon } from '../app-icon/app-icon';

const TONE_CLASSES: Record<DistributionTileTone, string> = {
  primary: 'bg-primary-tint text-primary',
  accent: 'bg-accent/16 text-accent',
};

/** The "توزيع …" card beside a merchant usage card: a tile per group and the plan limit. */
@Component({
  selector: 'app-distribution-card',
  imports: [AppIcon],
  templateUrl: './distribution-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DistributionCard {
  readonly heading = input.required<string>();
  readonly tiles = input.required<readonly DistributionTile[]>();
  readonly limitText = input.required<string>();

  protected readonly toneClasses = TONE_CLASSES;
}
