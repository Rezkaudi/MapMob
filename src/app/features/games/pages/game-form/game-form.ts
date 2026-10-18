import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CLOCK } from '../../../../core/config/clock';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FORM_CONTROL_CLASSES } from '../../../../shared/ui/form-field/form-control-classes';
import { FormField } from '../../../../shared/ui/form-field/form-field';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { FormSection } from '../../../../shared/ui/form-section/form-section';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import { GameDetail } from '../../models/game-detail';
import { GameSavedStatus } from '../../models/game-draft';
import { GAME_FORM_COPY } from '../../models/game-form-copy';
import {
  CURRENCY_OPTIONS,
  PRIZE_KIND_OPTIONS,
  TIME_ZONE_OPTIONS,
} from '../../models/game-form-options';
import { toGameDraft, toGameFormValue } from '../../state/game-draft-mapping';
import { GameFormErrors, buildGameFormErrors, isStartInPast } from '../../state/game-form-errors';
import {
  addQuestion,
  createGameFormGroup,
  removeQuestion,
  setQuestions,
} from '../../state/game-form-group';
import { GameFormStore } from '../../state/game-form.store';
import { GameQuestionFields } from '../../ui/game-question-fields/game-question-fields';

const GAMES_URL = '/admin/games';
/** The value is Latin and reads left to right, but the frame sets it against the icon on the right. */
const PICKER_CLASSES =
  'block h-[46px] w-full rounded border border-text-secondary bg-white pr-[47px] pl-4 text-right text-[14px]/[20px] text-text-primary outline-none focus:border-primary aria-invalid:border-closed [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-datetime-edit]:inline-block';

@Component({
  selector: 'app-game-form',
  imports: [
    AppIcon,
    ErrorState,
    FormActionBar,
    FormField,
    FormPageHeading,
    FormSection,
    GameQuestionFields,
    ReactiveFormsModule,
    Skeleton,
    Toast,
  ],
  templateUrl: './game-form.html',
  providers: [GameFormStore],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GameForm {
  /** Set on the edit route; the add route leaves it undefined. */
  readonly id = input<string | undefined>();

  private readonly router = inject(Router);
  private readonly clock = inject(CLOCK);
  protected readonly store = inject(GameFormStore);
  protected readonly form = createGameFormGroup();
  protected readonly controlClasses = FORM_CONTROL_CLASSES;
  protected readonly pickerClasses = PICKER_CLASSES;
  protected readonly gamesUrl = GAMES_URL;
  protected readonly prizeKindOptions = PRIZE_KIND_OPTIONS;
  protected readonly currencyOptions = CURRENCY_OPTIONS;
  protected readonly timeZoneOptions = TIME_ZONE_OPTIONS;
  protected readonly copy = computed(() => GAME_FORM_COPY[this.id() ? 'edit' : 'add']);

  constructor() {
    this.store.load(computed(() => this.id() ?? null));
    effect(() => {
      const detail = this.store.editedDetail();
      if (detail) {
        untracked(() => this.fillFrom(detail));
      }
    });
  }

  protected get errors(): GameFormErrors {
    return buildGameFormErrors(this.form, this.clock());
  }

  protected get isVoucher(): boolean {
    return this.form.controls.prizeKind.value === 'voucher';
  }

  protected addQuestion(): void {
    addQuestion(this.form);
  }

  protected removeQuestion(index: number): void {
    removeQuestion(this.form, index);
  }

  /** Date and time boxes open their picker on any click, not only on the hidden indicator. */
  protected openPicker(event: Event): void {
    (event.target as HTMLInputElement).showPicker?.();
  }

  protected publish(): void {
    this.form.markAllAsTouched();
    if (isStartInPast(this.form, this.clock())) {
      return;
    }
    this.save('scheduled');
  }

  protected saveDraft(): void {
    this.form.markAllAsTouched();
    this.save('draft');
  }

  private async save(status: GameSavedStatus): Promise<void> {
    if (this.form.invalid) {
      return;
    }
    const draft = toGameDraft(this.form.getRawValue(), status);
    if (await this.store.save(this.id() ?? null, draft)) {
      this.router.navigateByUrl(GAMES_URL);
    }
  }

  private fillFrom(detail: GameDetail): void {
    setQuestions(
      this.form,
      detail.questions.map((question) => ({
        text: question.text,
        options: question.options.map((option) => option.text),
      })),
    );
    this.form.reset(toGameFormValue(detail));
  }
}
