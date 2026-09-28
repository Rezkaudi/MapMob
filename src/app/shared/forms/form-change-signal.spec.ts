import { Injector, runInInjectionContext } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup } from '@angular/forms';
import { formChangeSignal } from './form-change-signal';

describe('formChangeSignal', () => {
  function watch(form: FormGroup) {
    return runInInjectionContext(TestBed.inject(Injector), () => formChangeSignal(form));
  }

  it('ticks when a value changes', () => {
    const form = new FormGroup({ name: new FormControl('') });
    const changes = watch(form);
    const before = changes();

    form.controls.name.setValue('صيدلية الحياة');

    expect(changes()).toBeGreaterThan(before);
  });

  it('ticks when the form is marked touched, so hidden errors can show', () => {
    const form = new FormGroup({ name: new FormControl('') });
    const changes = watch(form);
    const before = changes();

    form.markAllAsTouched();

    expect(changes()).toBeGreaterThan(before);
  });
});
