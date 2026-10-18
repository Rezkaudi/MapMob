import { buildGameFormErrors } from './game-form-errors';
import { createGameFormGroup } from './game-form-group';

const NOW = new Date('2026-10-11T09:00:00.000Z');

describe('buildGameFormErrors', () => {
  it('shows nothing before the admin touches a field', () => {
    const errors = buildGameFormErrors(createGameFormGroup(), NOW);
    expect(errors.name).toBeNull();
    expect(errors.questions).toEqual([{ text: null, firstOption: null, secondOption: null }]);
  });

  it('explains each touched field that is wrong', () => {
    const form = createGameFormGroup();
    form.patchValue({ voteSeconds: 0 });
    form.markAllAsTouched();

    const errors = buildGameFormErrors(form, NOW);

    expect(errors.name).toBe('أدخل اسم اللعبة');
    expect(errors.startsOn).toBe('اختر تاريخ الجلسة');
    expect(errors.startTime).toBe('اختر وقت انطلاق الجلسة');
    expect(errors.voteSeconds).toBe('أدخل عدد ثوانٍ أكبر من صفر');
    expect(errors.questions[0].text).toBe('اكتب نص السؤال');
  });

  it('refuses a start that has already passed', () => {
    const form = createGameFormGroup();
    form.patchValue({ startsOn: '2026-10-10', startTime: '18:00' });
    form.markAllAsTouched();
    expect(buildGameFormErrors(form, NOW).startsOn).toBe('اختر موعداً لم يمضِ بعد');
  });
});
