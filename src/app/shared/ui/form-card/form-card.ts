import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';

let nextHeadingNumber = 0;
const DEFAULT_ICON_SIZE_PX = 20;

/** One white card of the ad form: an icon and title over a thin line, then the fields 24px below. */
@Component({
  selector: 'app-form-card',
  imports: [AppIcon],
  templateUrl: './form-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormCard {
  readonly heading = input.required<string>();
  readonly icon = input.required<string>();
  readonly iconSize = input<number>(DEFAULT_ICON_SIZE_PX);

  protected readonly headingId = `form-card-heading-${nextHeadingNumber++}`;
}
