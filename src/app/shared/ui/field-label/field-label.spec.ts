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

  it('draws the compact 12/16 label of the product dialog, with the star 4px after the text', () => {
    const fixture = TestBed.createComponent(FieldLabel);
    fixture.componentRef.setInput('text', 'السعر');
    fixture.componentRef.setInput('isRequired', true);
    fixture.componentRef.setInput('size', 'compact');
    fixture.detectChanges();

    const label: HTMLElement = fixture.nativeElement.querySelector('label');
    expect(label.classList).toContain('text-[12px]/[16px]');
    expect(label.classList).toContain('gap-1');
    expect(label.classList).toContain('font-medium');
    expect([...label.children].map((child) => child.textContent?.trim())).toEqual(['السعر', '*']);
  });

  it('keeps the place form label at 13/14 by default', () => {
    const fixture = TestBed.createComponent(FieldLabel);
    fixture.componentRef.setInput('text', 'اسم المكان');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('label').classList).toContain('text-[13px]/[14px]');
  });
});
