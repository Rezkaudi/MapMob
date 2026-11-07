import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { BackButton } from '../../../../shared/ui/back-button/back-button';

@Component({
  selector: 'app-region-empty-state',
  imports: [BackButton],
  templateUrl: './region-empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionEmptyState {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
