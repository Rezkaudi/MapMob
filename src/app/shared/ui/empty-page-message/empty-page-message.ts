import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AddButton } from '../add-button/add-button';

/** "Nothing added yet" with a button to add the first one, centred on the page. */
@Component({
  selector: 'app-empty-page-message',
  imports: [AddButton],
  templateUrl: './empty-page-message.html',
  host: { class: 'absolute inset-0 flex items-center justify-center' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyPageMessage {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
  readonly addLabel = input.required<string>();
  readonly add = output<void>();
}
