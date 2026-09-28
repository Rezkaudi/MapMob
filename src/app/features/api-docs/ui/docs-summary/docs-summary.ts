import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HTTP_METHODS, HttpMethod } from '../../models/http-method';
import { EndpointCounts } from '../../state/endpoint-counts';

const PERCENT = 100;

const METHOD_BAR: Record<HttpMethod, string> = {
  GET: 'bg-[#38BDF8]',
  POST: 'bg-[#34D399]',
  PUT: 'bg-[#FBBF24]',
  PATCH: 'bg-[#A78BFA]',
  DELETE: 'bg-[#F87171]',
};

@Component({
  selector: 'app-docs-summary',
  templateUrl: './docs-summary.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DocsSummary {
  readonly counts = input.required<EndpointCounts>();
  readonly featureCount = input.required<number>();
  readonly tableCount = input.required<number>();

  protected readonly methods = computed(() => {
    const { total, byMethod } = this.counts();
    return HTTP_METHODS.map((method) => ({
      method,
      count: byMethod[method],
      percent: total ? (byMethod[method] / total) * PERCENT : 0,
      bar: METHOD_BAR[method],
    }));
  });
}
