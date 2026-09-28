import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CountTile } from '../../models/count-tile';

/** The white card of grey count tiles beside a merchant usage card. */
@Component({
  selector: 'app-count-tiles',
  templateUrl: './count-tiles.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CountTiles {
  readonly tiles = input.required<readonly CountTile[]>();
}
