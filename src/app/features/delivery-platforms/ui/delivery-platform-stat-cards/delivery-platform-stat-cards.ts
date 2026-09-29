import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { DeliveryPlatformStatCard } from '../../state/delivery-platform-stat-cards';

@Component({
  selector: 'app-delivery-platform-stat-cards',
  imports: [StatCard],
  templateUrl: './delivery-platform-stat-cards.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPlatformStatCards {
  readonly cards = input.required<readonly DeliveryPlatformStatCard[]>();
  readonly isLoading = input<boolean>(false);
}
