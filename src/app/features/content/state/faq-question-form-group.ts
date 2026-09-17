import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FaqQuestionDraft } from '../models/faq-question-draft';
import { hasText } from '../../../shared/forms/has-text';

/** The "0 / 250" limit the dialog draws beside the answer label. */
export const FAQ_ANSWER_MAX_LENGTH = 250;

export function createFaqQuestionFormGroup() {
  return new FormGroup({
    question: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, hasText],
    }),
    answer: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, hasText, Validators.maxLength(FAQ_ANSWER_MAX_LENGTH)],
    }),
  });
}

export type FaqQuestionFormGroup = ReturnType<typeof createFaqQuestionFormGroup>;

export function toFaqQuestionDraft(value: FaqQuestionDraft): FaqQuestionDraft {
  return { question: value.question.trim(), answer: value.answer.trim() };
}
