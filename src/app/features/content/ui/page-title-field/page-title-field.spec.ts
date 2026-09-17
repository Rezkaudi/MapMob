import { TestBed } from '@angular/core/testing';
import { FormControl, Validators } from '@angular/forms';
import { PageTitleField } from './page-title-field';

function render(control: FormControl<string>) {
  const fixture = TestBed.createComponent(PageTitleField);
  fixture.componentRef.setInput('control', control);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('PageTitleField', () => {
  it('labels the 50px title box and edits the control', () => {
    const control = new FormControl('عن التطبيق', { nonNullable: true });
    const { element } = render(control);
    const input = element.querySelector('input') as HTMLInputElement;

    expect(element.querySelector('label')?.textContent).toContain('عنوان الصفحة');
    expect(input.id).toBe('page-title');
    expect(input.value).toBe('عن التطبيق');

    input.value = 'من نحن';
    input.dispatchEvent(new Event('input'));
    expect(control.value).toBe('من نحن');
  });

  it('says the title is missing once touched', () => {
    const control = new FormControl('', { nonNullable: true, validators: Validators.required });
    const { fixture, element } = render(control);

    control.markAsTouched();
    fixture.componentRef.setInput('control', control);
    fixture.detectChanges();

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('اكتب عنوان الصفحة');
    expect(element.querySelector('input')?.getAttribute('aria-invalid')).toBe('true');
  });
});
