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
  readonly valueChange = output<BillingCycle>();
}
