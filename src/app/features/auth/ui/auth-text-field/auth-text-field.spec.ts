import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { AuthTextField } from './auth-text-field';

function render(control = new FormControl('', { nonNullable: true })) {
  const fixture = TestBed.createComponent(AuthTextField);
  fixture.componentRef.setInput('label', 'البريد الالكتروني');
  fixture.componentRef.setInput('inputId', 'email');
  fixture.componentRef.setInput('placeholder', 'name@gmail.com');
  fixture.componentRef.setInput('control', control);
  fixture.detectChanges();
  return { element: fixture.nativeElement as HTMLElement, control };
}

describe('AuthTextField', () => {
  it('ties the label to the input', () => {
    const { element } = render();

    expect(element.querySelector('label')!.getAttribute('for')).toBe('email');
    expect(element.querySelector('input')!.id).toBe('email');
  });

  it('starts the label at the reading start, so RTL puts it on the right edge', () => {
    const { element } = render();

    const label = element.querySelector('label')!;
    expect(label.parentElement!.classList).toContain('items-start');
    expect(label.classList).toContain('text-right');
  });

  it('keeps the Latin email in its own order while hugging the right edge', () => {
    const { element } = render();

    const input = element.querySelector('input')!;
    expect(input.getAttribute('dir')).toBe('ltr');
    expect(input.classList).toContain('text-right');
  });

  it('writes what is typed into the control', () => {
    const { element, control } = render();

    const input = element.querySelector('input')!;
    input.value = 'merchant@mapmob.com';
    input.dispatchEvent(new Event('input'));

    expect(control.value).toBe('merchant@mapmob.com');
  });
});
