import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { ApiEndpoint } from '../../models/api-endpoint';
import { ApiFeature } from '../../models/api-feature';
import { EndpointDetails } from '../endpoint-details/endpoint-details';
import { MethodBadge } from '../method-badge/method-badge';

@Component({
  selector: 'app-endpoint-card',
  imports: [EndpointDetails, MethodBadge],
  templateUrl: './endpoint-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EndpointCard {
  readonly feature = input.required<ApiFeature>();
  readonly endpoint = input.required<ApiEndpoint>();
  readonly isOpen = input.required<boolean>();
  readonly toggle = output<string>();
}
