import { ChangeDetectionStrategy, Component, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

/** The dashed card that closes the gallery grid. */
@Component({
  selector: 'app-media-add-tile',
  imports: [AppIcon],
  templateUrl: './media-add-tile.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaAddTile {
  readonly pressed = output<void>();
}
