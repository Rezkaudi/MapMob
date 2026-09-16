import { TestBed } from '@angular/core/testing';
import { FormBuilder } from '@angular/forms';
import { buildAdFormErrors } from '../../state/ad-form-errors';
import { createAdFormGroup } from '../../state/ad-form-group';
import { AdScheduleCard } from './ad-schedule-card';

function render() {
  const form = createAdFormGroup(TestBed.inject(FormBuilder));
  const fixture = TestBed.createComponent(AdScheduleCard);
  fixture.componentRef.setInput('form', form);
  fixture.componentRef.setInput('errors', buildAdFormErrors(form));
  fixture.detectChanges();
  return { fixture, form, element: fixture.nativeElement as HTMLElement };
}

describe('AdScheduleCard', () => {
  it('lays out the days on top and the priority and status below', () => {
    const { element } = render();
    const text = element.textContent ?? '';

    for (const words of [
      'مدة العرض، الأولوية والحالة',
      'تاريخ البدء',
      'تاريخ الانتهاء',
      'بدون تاريخ انتهاء (إعلان دائم / مستمر)',
      'أولوية الإعلان',
      'حالة الإعلان الأولية',
    ]) {
      expect(text).toContain(words);
    }
    expect(
      (
        element.querySelector('#ad-priority') as HTMLSelectElement
      ).selectedOptions[0].textContent?.trim(),
    ).toBe('5 — عالية جداً (أولوية قصوى في الظهور)');
    expect(
      (
        element.querySelector('#ad-status') as HTMLSelectElement
      ).selectedOptions[0].textContent?.trim(),
    ).toBe('نشط (يبدأ العرض فوراً عند التاريخ)');
  });

  it('clears and locks the last day while the ad never ends', () => {
    const { fixture, form, element } = render();
    const endDay = element.querySelector('#ad-ends-on') as HTMLInputElement;
    form.controls.endsOn.setValue('2026-10-30');
    fixture.detectChanges();

    (element.querySelector('#ad-is-ongoing') as HTMLInputElement).click();
    fixture.detectChanges();

    expect(form.controls.isOngoing.value).toBe(true);
    expect(form.controls.endsOn.value).toBeNull();
    expect(endDay.disabled).toBe(true);
  });
});
