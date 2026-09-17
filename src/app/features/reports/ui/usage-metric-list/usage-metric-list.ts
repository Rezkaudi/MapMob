import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShareBar } from '../../../../shared/ui/share-bar/share-bar';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { ShareRow } from '../../models/share-row';

const PLACEHOLDER_ROWS = [0, 1, 2, 3] as const;

/** Full-width bars, each under its label and count. */
@Component({
  selector: 'app-usage-metric-list',
  imports: [ShareBar, Skeleton],
  templateUrl: './usage-metric-list.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UsageMetricList {
  readonly rows = input.required<readonly ShareRow[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly placeholderRows = PLACEHOLDER_ROWS;
}
