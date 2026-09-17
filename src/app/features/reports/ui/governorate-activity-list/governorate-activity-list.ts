import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ShareBar } from '../../../../shared/ui/share-bar/share-bar';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { ShareRow } from '../../models/share-row';

const PLACEHOLDER_ROWS = [0, 1, 2, 3, 4] as const;

/** A card of governorates, each on one line: name, a short bar, then visits and share. */
@Component({
  selector: 'app-governorate-activity-list',
  imports: [ShareBar, Skeleton],
  templateUrl: './governorate-activity-list.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GovernorateActivityList {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly rows = input.required<readonly ShareRow[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly placeholderRows = PLACEHOLDER_ROWS;
}
