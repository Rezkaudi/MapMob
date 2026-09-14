import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RegionAddButton } from '../region-add-button/region-add-button';

@Component({
  selector: 'app-region-page-header',
  imports: [RegionAddButton],
  templateUrl: './region-page-header.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionPageHeader {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly addLabel = input.required<string>();
  /** The empty page carries its own centred add button, so the header hides this one. */
  readonly isAddVisible = input<boolean>(true);
  readonly add = output<void>();
}
