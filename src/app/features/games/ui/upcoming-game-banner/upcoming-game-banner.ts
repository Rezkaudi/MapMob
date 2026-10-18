import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { UpcomingGameView } from '../../models/upcoming-game-view';

/** The card under the numbers that names the next game and opens it. */
@Component({
  selector: 'app-upcoming-game-banner',
  imports: [AppIcon],
  templateUrl: './upcoming-game-banner.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UpcomingGameBanner {
  readonly view = input.required<UpcomingGameView>();
  readonly viewDetails = output<void>();
  readonly reschedule = output<void>();
}
