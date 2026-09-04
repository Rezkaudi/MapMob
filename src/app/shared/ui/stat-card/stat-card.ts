import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-stat-card',
  imports: [AppIcon],
  templateUrl: './stat-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  /** Matches a file in `public/assets/icons`. */
  readonly icon = input.required<string>();
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
  /** Optional "+320 جديد" style chip shown next to the value. */
  readonly delta = input<string | null>(null);
}
