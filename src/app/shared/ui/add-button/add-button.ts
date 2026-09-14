import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

@Component({
  selector: 'app-add-button',
  imports: [AppIcon],
  templateUrl: './add-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddButton {
  readonly label = input.required<string>();
  readonly pressed = output<void>();
}
