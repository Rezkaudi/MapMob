import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

const DEFAULT_ICON_SIZE_PX = 16;

/** A 12px label on the right, the grey control under it with its icon at the right edge. */
@Component({
  selector: 'app-store-field',
  imports: [AppIcon],
  templateUrl: './store-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreField {
  readonly label = input.required<string>();
  readonly forId = input<string>('');
  readonly isRequired = input<boolean>(false);
  /** "300/124": the limit, then the typed length, drawn at the left end of the label row. */
  readonly counter = input<string>('');
  readonly error = input<string | null>(null);
  readonly icon = input<string | null>(null);
  readonly iconSize = input<number>(DEFAULT_ICON_SIZE_PX);
  /** The name field's icon is grey; the contact icons are drawn in the text colour. */
  readonly isIconMuted = input<boolean>(false);
}
