import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/**
 * A titled card with an optional count badge, a subtitle and one action button
 * on the far side of the header. Sized from the 671×402 offers section.
 */
@Component({
  selector: 'app-section-panel',
  imports: [AppIcon],
  templateUrl: './section-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionPanel {
  readonly heading = input.required<string>();
  readonly badge = input<string>('');
  readonly subtitle = input<string>('');
  readonly actionLabel = input<string>('');
  readonly actionIcon = input<string>('plus');
  readonly action = output<void>();
}
