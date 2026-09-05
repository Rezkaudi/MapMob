import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

/** A white panel with a heading and an optional "تعديل" link, as the detail page uses. */
@Component({
  selector: 'app-info-card',
  imports: [AppIcon],
  templateUrl: './info-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InfoCard {
  readonly heading = input.required<string>();
  readonly canEdit = input<boolean>(false);
  readonly edit = output<void>();
}
