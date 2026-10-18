import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { GameQuestionErrors } from '../../state/game-form-errors';
import { createQuestionGroup } from '../../state/game-form-group';

const CONTROL_CLASSES =
  'block h-[42px] w-full rounded border border-text-secondary bg-white px-3 py-2 text-start text-[16px]/[24px] text-text-primary outline-none placeholder:text-[#94a3b8] focus:border-primary aria-invalid:border-closed';

/** One question of the game form: its text and the two choices players vote on. */
@Component({
  selector: 'app-game-question-fields',
  imports: [AppIcon, ReactiveFormsModule],
  templateUrl: './game-question-fields.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameQuestionFields {
  readonly group = input.required<FormGroup<ReturnType<typeof createQuestionGroup>['controls']>>();
  /** Zero-based; the frame writes it from 1. */
  readonly index = input.required<number>();
  readonly errors = input.required<GameQuestionErrors>();
  readonly canRemove = input<boolean>(false);
  readonly remove = output<void>();

  protected readonly controlClasses = CONTROL_CLASSES;
}
