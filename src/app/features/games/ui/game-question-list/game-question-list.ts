import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { GameQuestionView } from '../../models/game-question-view';

/** The questions of a game as folding cards; a finished game shows how the votes fell. */
@Component({
  selector: 'app-game-question-list',
  imports: [AppIcon],
  templateUrl: './game-question-list.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameQuestionList {
  readonly questions = input.required<readonly GameQuestionView[]>();
  readonly countText = input.required<string>();
  readonly expandedIds = input.required<readonly string[]>();
  readonly toggle = output<string>();
}
