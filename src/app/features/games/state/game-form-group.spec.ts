import { addQuestion, createGameFormGroup, removeQuestion, setQuestions } from './game-form-group';

describe('game form group', () => {
  it('starts with one empty question and the frame defaults', () => {
    const form = createGameFormGroup();
    expect(form.controls.questions.length).toBe(1);
    expect(form.getRawValue()).toMatchObject({
      timeZone: 'Asia/Damascus',
      voteSeconds: 10,
      prizeKind: 'cash',
      currency: 'SYP',
      prizeAmount: 50000,
      maxWinnerCount: 10,
    });
  });

  it('asks for the name, the day, the time and every question text and choice', () => {
    const form = createGameFormGroup();
    expect(form.controls.name.hasError('required')).toBe(true);
    expect(form.controls.startsOn.hasError('required')).toBe(true);
    expect(form.controls.startTime.hasError('required')).toBe(true);
    const question = form.controls.questions.at(0).controls;
    expect(question.text.hasError('required')).toBe(true);
    expect(question.firstOption.hasError('required')).toBe(true);
    expect(question.secondOption.hasError('required')).toBe(true);
    expect(form.controls.description.valid).toBe(true);
  });

  it('wants a vote time, a prize amount and a winner count above zero', () => {
    const form = createGameFormGroup();
    form.patchValue({ voteSeconds: 0, prizeAmount: 0, maxWinnerCount: 0 });
    expect(form.controls.voteSeconds.invalid).toBe(true);
    expect(form.controls.prizeAmount.invalid).toBe(true);
    expect(form.controls.maxWinnerCount.invalid).toBe(true);
  });

  it('asks who gives a voucher, and only for a voucher', () => {
    const form = createGameFormGroup();
    expect(form.controls.sponsorName.valid).toBe(true);
    form.controls.prizeKind.setValue('voucher');
    expect(form.controls.sponsorName.hasError('required')).toBe(true);
    form.controls.prizeKind.setValue('cash');
    expect(form.controls.sponsorName.valid).toBe(true);
  });

  it('adds and removes questions, keeping at least one', () => {
    const form = createGameFormGroup();
    addQuestion(form);
    expect(form.controls.questions.length).toBe(2);
    removeQuestion(form, 0);
    removeQuestion(form, 0);
    expect(form.controls.questions.length).toBe(1);
  });

  it('replaces the questions with saved ones', () => {
    const form = createGameFormGroup();
    setQuestions(form, [
      { text: 'أ؟', options: ['1', '2'] },
      { text: 'ب؟', options: ['3', '4'] },
    ]);
    expect(form.controls.questions.getRawValue()).toEqual([
      { text: 'أ؟', firstOption: '1', secondOption: '2' },
      { text: 'ب؟', firstOption: '3', secondOption: '4' },
    ]);
  });
});
