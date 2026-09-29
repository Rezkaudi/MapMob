import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { BillingCycle } from '../../models/billing-cycle';

@Component({
  selector: 'app-billing-cycle-toggle',
  templateUrl: './billing-cycle-toggle.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BillingCycleToggle {
  readonly value = input.required<BillingCycle>();
  /** Admin says "خصم 20%"; the merchant frame says "وفر 20%". */
  readonly savingLabel = input<string>('خصم 20%');
  readonly valueChange = output<BillingCycle>();
}
