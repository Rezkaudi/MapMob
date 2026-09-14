import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-region-empty-state',
  templateUrl: './region-empty-state.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionEmptyState {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
