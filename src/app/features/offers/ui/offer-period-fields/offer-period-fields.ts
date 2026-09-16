import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { DateRange } from '../../../../shared/models/date-range';
import { DateField } from '../../../../shared/ui/date-field/date-field';

/** "من" and "إلى" with a 200×40 date box each, as the offer form lays out "مدة العرض". */
@Component({
  selector: 'app-offer-period-fields',
  imports: [DateField],
  templateUrl: './offer-period-fields.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfferPeriodFields {
  readonly range = input.required<DateRange>();
  readonly rangeChange = output<DateRange>();

  protected changeFrom(from: string | null): void {
    this.rangeChange.emit({ ...this.range(), from });
  }

  protected changeTo(to: string | null): void {
    this.rangeChange.emit({ ...this.range(), to });
  }
}
