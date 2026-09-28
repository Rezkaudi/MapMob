import { TestBed } from '@angular/core/testing';
import { FormControl } from '@angular/forms';
import { AuthPasswordField } from './auth-password-field';

function render() {
  const control = new FormControl('', { nonNullable: true });
  const fixture = TestBed.createComponent(AuthPasswordField);
  fixture.componentRef.setInput('label', 'كلمة المرور');
  fixture.componentRef.setInput('inputId', 'password');
  fixture.componentRef.setInput('control', control);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, control };
}

describe('AuthPasswordField', () => {
  it('starts the label at the reading start, so RTL puts it on the right edge', () => {
    const { element } = render();

    const label = element.querySelector('label')!;
    expect(label.getAttribute('for')).toBe('password');
    expect(label.parentElement!.classList).toContain('items-start');
  });

  it('writes the input before the eye toggle, so the toggle lands on the left', () => {
    const { element } = render();

    const box = element.querySelector('input')!.parentElement!;
    expect([...box.children].map((child) => child.tagName)).toEqual(['INPUT', 'BUTTON']);
  });

  it('hides the password until the eye is pressed', () => {
    const { fixture, element } = render();
    const input = () => element.querySelector('input')!;
    expect(input().type).toBe('password');

    element.querySelector('button')!.click();
    fixture.detectChanges();

    expect(input().type).toBe('text');
    expect(element.querySelector('button')!.getAttribute('aria-label')).toBe('إخفاء كلمة المرور');
  });

  it('keeps the Latin password in its own order while hugging the right edge', () => {
    const { element } = render();

    const input = element.querySelector('input')!;
    expect(input.getAttribute('dir')).toBe('ltr');
    expect(input.classList).toContain('text-right');
  });
});
