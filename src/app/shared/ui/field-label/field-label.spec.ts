import { TestBed } from '@angular/core/testing';
import { FieldLabel } from './field-label';

describe('FieldLabel', () => {
  it('marks a required field with a star', () => {
    const fixture = TestBed.createComponent(FieldLabel);
    fixture.componentRef.setInput('text', 'اسم المكان');
    fixture.componentRef.setInput('isRequired', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('اسم المكان');
    expect(fixture.nativeElement.querySelector('.text-error').textContent).toBe('*');
  });
});
