import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The title row every overview card starts with: optional icon tile, title, "عرض الكل". */
@Component({
  selector: 'app-overview-card-heading',
  imports: [AppIcon, RouterLink],
  templateUrl: './overview-card-heading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OverviewCardHeading {
  readonly title = input.required<string>();
  readonly icon = input<string | null>(null);
  /** Background of the 40px tile, e.g. `bg-accent`. */
  readonly iconTileClass = input<string>('');
  readonly viewAllRoute = input<string | null>(null);
}
