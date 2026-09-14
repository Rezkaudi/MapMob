import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The white 8px-rounded cards of the user detail page, with a coloured icon and an optional link. */
@Component({
  selector: 'app-detail-section-card',
  imports: [AppIcon],
  templateUrl: './detail-section-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DetailSectionCard {
  readonly heading = input.required<string>();
  readonly icon = input.required<string>();
  readonly iconSize = input<number>(18);
  /** Tailwind text colour for the icon. */
  readonly iconClass = input<string>('text-primary');
  readonly actionLabel = input<string>('');
  readonly action = output<void>();
}
