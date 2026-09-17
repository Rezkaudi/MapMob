import {
  FAQ_ANSWER_MAX_LENGTH,
  createFaqQuestionFormGroup,
  toFaqQuestionDraft,
} from './faq-question-form-group';

describe('createFaqQuestionFormGroup', () => {
  it('needs a question and an answer of at most 250 characters', () => {
    const form = createFaqQuestionFormGroup();
    expect(FAQ_ANSWER_MAX_LENGTH).toBe(250);

    form.setValue({ question: ' ', answer: '' });
    expect(form.controls.question.invalid).toBe(true);
    expect(form.controls.answer.invalid).toBe(true);

    form.setValue({ question: 'سؤال؟', answer: 'ج'.repeat(251) });
    expect(form.controls.answer.hasError('maxlength')).toBe(true);

    form.controls.answer.setValue('ج'.repeat(250));
    expect(form.valid).toBe(true);
  });

  it('trims the draft', () => {
    expect(toFaqQuestionDraft({ question: ' سؤال؟ ', answer: ' جواب ' })).toEqual({
      question: 'سؤال؟',
      answer: 'جواب',
    });
  });
});
