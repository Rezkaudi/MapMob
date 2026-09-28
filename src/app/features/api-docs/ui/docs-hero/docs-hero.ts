import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { EndpointCounts } from '../../state/endpoint-counts';
import { DocsSummary } from '../docs-summary/docs-summary';

@Component({
  selector: 'app-docs-hero',
  imports: [DocsSummary],
  templateUrl: './docs-hero.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsHero {
  readonly title = input.required<string>();
  readonly updatedOn = input.required<string>();
  readonly counts = input.required<EndpointCounts>();
  readonly featureCount = input.required<number>();
  readonly tableCount = input.required<number>();
  readonly jumpToExport = output<void>();
}
