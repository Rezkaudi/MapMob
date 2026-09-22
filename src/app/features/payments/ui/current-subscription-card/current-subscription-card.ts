import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { SlashDatePipe } from '../../../../shared/pipes/slash-date.pipe';

/** The grey box the upgrade and renewal frames put above the plan field. */
@Component({
  selector: 'app-current-subscription-card',
  imports: [SlashDatePipe],
  templateUrl: './current-subscription-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CurrentSubscriptionCard {
  readonly planName = input.required<string>();
  /** A calendar day written `yyyy-mm-dd`. */
  readonly endsOn = input.required<string>();
}
