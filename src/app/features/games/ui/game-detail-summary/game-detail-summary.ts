import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { GameDetailView } from '../../models/game-detail-view';

/** The grey box under the modal title: name, start, status, questions and prize. */
@Component({
  selector: 'app-game-detail-summary',
  templateUrl: './game-detail-summary.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameDetailSummary {
  readonly view = input.required<GameDetailView>();
}
