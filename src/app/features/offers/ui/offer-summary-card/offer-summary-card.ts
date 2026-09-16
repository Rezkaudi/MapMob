import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-offer-summary-card',
  templateUrl: './offer-summary-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferSummaryCard {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
