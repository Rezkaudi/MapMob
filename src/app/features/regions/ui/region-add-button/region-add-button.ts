import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

@Component({
  selector: 'app-region-add-button',
  imports: [AppIcon],
  templateUrl: './region-add-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RegionAddButton {
  readonly label = input.required<string>();
  readonly pressed = output<void>();
}
