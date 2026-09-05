import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormSection } from './form-section';

@Component({
  imports: [FormSection],
  template: `<app-form-section heading="المعلومات الأساسية" icon="info">الحقول</app-form-section>`,
})
class HostComponent {}

describe('FormSection', () => {
  it('renders the heading and the projected fields', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('المعلومات الأساسية');
    expect(text).toContain('الحقول');
  });
});
