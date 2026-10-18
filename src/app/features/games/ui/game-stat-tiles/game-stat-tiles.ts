import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { GameDetailTiles } from '../../models/game-detail-view';

/** The four numbers of a finished game, under its summary. */
@Component({
  selector: 'app-game-stat-tiles',
  imports: [AppIcon],
  templateUrl: './game-stat-tiles.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameStatTiles {
  readonly tiles = input.required<GameDetailTiles>();
}
