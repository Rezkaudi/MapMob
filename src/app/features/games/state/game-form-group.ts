import {
  AbstractControl,
  FormArray,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { CurrencyCode } from '../../../shared/money/currency-code';
import { GameQuestionDraft } from '../models/game-draft';
import { DEFAULT_GAME_TIME_ZONE } from '../models/game-time-zone';
import { PrizeKind } from '../models/prize-kind';

/** The values the add frame shows before the admin types anything. */
const DEFAULT_VOTE_SECONDS = 10;
const DEFAULT_PRIZE_AMOUNT = 50000;
const DEFAULT_MAX_WINNERS = 10;
const NAME_MAX_LENGTH = 100;
const LOWEST_COUNT = 1;
const MIN_QUESTION_COUNT = 1;

function requiredText(value = ''): FormControl<string> {
  return new FormControl(value, { nonNullable: true, validators: Validators.required });
}

function positiveNumber(value: number | null): FormControl<number | null> {
  return new FormControl(value, [Validators.required, Validators.min(LOWEST_COUNT)]);
}

/** Read on every check, so it follows the prize kind as it changes. */
function sponsorRequiredForVoucher(control: AbstractControl): ValidationErrors | null {
  const isVoucher = control.parent?.get('prizeKind')?.value === 'voucher';
  return isVoucher && !String(control.value ?? '').trim() ? { required: true } : null;
}

export function createQuestionGroup(question: GameQuestionDraft | null = null) {
  return new FormGroup({
    text: requiredText(question?.text),
    firstOption: requiredText(question?.options[0]),
    secondOption: requiredText(question?.options[1]),
  });
}

export function createGameFormGroup() {
  const form = new FormGroup({
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(NAME_MAX_LENGTH)],
    }),
    description: new FormControl('', { nonNullable: true }),
    startsOn: requiredText(),
    startTime: requiredText(),
    timeZone: requiredText(DEFAULT_GAME_TIME_ZONE.id),
    voteSeconds: positiveNumber(DEFAULT_VOTE_SECONDS),
    questions: new FormArray([createQuestionGroup()]),
    prizeKind: new FormControl<PrizeKind>('cash', { nonNullable: true }),
    currency: new FormControl<CurrencyCode>('SYP', { nonNullable: true }),
    prizeAmount: positiveNumber(DEFAULT_PRIZE_AMOUNT),
    sponsorName: new FormControl('', { nonNullable: true, validators: sponsorRequiredForVoucher }),
    maxWinnerCount: positiveNumber(DEFAULT_MAX_WINNERS),
  });
  form.controls.prizeKind.valueChanges.subscribe(() =>
    form.controls.sponsorName.updateValueAndValidity(),
  );
  return form;
}

export type GameFormGroup = ReturnType<typeof createGameFormGroup>;
export type GameFormValue = ReturnType<GameFormGroup['getRawValue']>;

export function addQuestion(form: GameFormGroup): void {
  form.controls.questions.push(createQuestionGroup());
}

export function removeQuestion(form: GameFormGroup, index: number): void {
  if (form.controls.questions.length > MIN_QUESTION_COUNT) {
    form.controls.questions.removeAt(index);
  }
}

export function setQuestions(form: GameFormGroup, questions: readonly GameQuestionDraft[]): void {
  form.controls.questions.clear();
  for (const question of questions) {
    form.controls.questions.push(createQuestionGroup(question));
  }
}
