import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ApiFeature } from '../../models/api-feature';
import { EndpointCard } from '../endpoint-card/endpoint-card';

@Component({
  selector: 'app-endpoint-section',
  imports: [EndpointCard],
  templateUrl: './endpoint-section.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndpointSection {
  readonly feature = input.required<ApiFeature>();
  readonly openEndpointIds = input.required<ReadonlySet<string>>();
  /** While printing, every endpoint shows open. */
  readonly isAllOpen = input(false);
  readonly toggle = output<string>();
}
