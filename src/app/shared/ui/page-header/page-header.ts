import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AddButton } from '../add-button/add-button';

@Component({
  selector: 'app-page-header',
  imports: [AddButton],
  templateUrl: './page-header.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PageHeader {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly addLabel = input.required<string>();
  /** The empty page carries its own centred add button, so the header hides this one. */
  readonly isAddVisible = input<boolean>(true);
  readonly add = output<void>();
}
