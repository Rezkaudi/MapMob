import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { LatinDigitDatePipe } from '../../../../shared/pipes/latin-digit-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

@Component({
  selector: 'app-offer-validity-card',
  imports: [AppIcon, LatinDigitDatePipe],
  templateUrl: './offer-validity-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferValidityCard {
  /** Calendar days written `yyyy-mm-dd`. */
  readonly startsOn = input.required<string>();
  readonly endsOn = input.required<string>();
}
