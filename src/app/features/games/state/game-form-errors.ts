import { touchedError } from '../../../shared/forms/touched-error';
import { DEFAULT_GAME_TIME_ZONE, GAME_TIME_ZONES } from '../models/game-time-zone';
import { GameFormGroup, createQuestionGroup } from './game-form-group';
import { toGameStartsAt } from './game-schedule-text';

const PAST_START_MESSAGE = 'اختر موعداً لم يمضِ بعد';

export interface GameQuestionErrors {
  readonly text: string | null;
  readonly firstOption: string | null;
  readonly secondOption: string | null;
}

export interface GameFormErrors {
  readonly name: string | null;
  readonly startsOn: string | null;
  readonly startTime: string | null;
  readonly voteSeconds: string | null;
  readonly prizeAmount: string | null;
  readonly sponsorName: string | null;
  readonly maxWinnerCount: string | null;
  readonly questions: readonly GameQuestionErrors[];
}

type QuestionGroup = ReturnType<typeof createQuestionGroup>;

function questionErrors({ controls }: QuestionGroup): GameQuestionErrors {
  return {
    text: touchedError(controls.text, 'اكتب نص السؤال'),
    firstOption: touchedError(controls.firstOption, 'اكتب الخيار الأول'),
    secondOption: touchedError(controls.secondOption, 'اكتب الخيار الثاني'),
  };
}

/** A published game must start later than now; a draft may keep any day. */
export function isStartInPast(form: GameFormGroup, now: Date): boolean {
  const { startsOn, startTime, timeZone } = form.getRawValue();
  if (!startsOn || !startTime) {
    return false;
  }
  const zone = GAME_TIME_ZONES.find((one) => one.id === timeZone) ?? DEFAULT_GAME_TIME_ZONE;
  return new Date(toGameStartsAt(startsOn, startTime, zone.utcOffset)) <= now;
}

function startsOnError(form: GameFormGroup, now: Date): string | null {
  const control = form.controls.startsOn;
  if (control.touched && isStartInPast(form, now)) {
    return PAST_START_MESSAGE;
  }
  return touchedError(control, 'اختر تاريخ الجلسة');
}

export function buildGameFormErrors(form: GameFormGroup, now: Date): GameFormErrors {
  const { controls } = form;
  return {
    name: touchedError(controls.name, 'أدخل اسم اللعبة'),
    startsOn: startsOnError(form, now),
    startTime: touchedError(controls.startTime, 'اختر وقت انطلاق الجلسة'),
    voteSeconds: touchedError(controls.voteSeconds, 'أدخل عدد ثوانٍ أكبر من صفر'),
    prizeAmount: touchedError(controls.prizeAmount, 'أدخل قيمة أكبر من صفر'),
    sponsorName: touchedError(controls.sponsorName, 'أدخل الجهة المقدمة للقسيمة'),
    maxWinnerCount: touchedError(controls.maxWinnerCount, 'أدخل عدداً أكبر من صفر'),
    questions: controls.questions.controls.map(questionErrors),
  };
}
