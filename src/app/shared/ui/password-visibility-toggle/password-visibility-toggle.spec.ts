import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PasswordVisibilityToggle } from './password-visibility-toggle';

@Component({
  imports: [PasswordVisibilityToggle],
  template: `<button appPasswordVisibilityToggle [(isVisible)]="isPasswordVisible"></button>`,
})
class Host {
  readonly isPasswordVisible = signal(false);
}

function render() {
  const fixture = TestBed.createComponent(Host);
  fixture.detectChanges();
  const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
  return { fixture, button };
}

describe('PasswordVisibilityToggle', () => {
  it('is a plain button, so it never submits the form', () => {
    const { button } = render();

    expect(button.type).toBe('button');
  });

  it('offers to show the password while it is hidden', () => {
    const { button } = render();

    expect(button.getAttribute('aria-label')).toBe('إظهار كلمة المرور');
    expect(button.getAttribute('aria-pressed')).toBe('false');
    expect(button.querySelector('app-icon')).not.toBeNull();
  });

  it('flips the bound visibility on click and offers to hide it again', () => {
    const { fixture, button } = render();

    button.click();
    fixture.detectChanges();

    expect(fixture.componentInstance.isPasswordVisible()).toBe(true);
    expect(button.getAttribute('aria-label')).toBe('إخفاء كلمة المرور');
    expect(button.getAttribute('aria-pressed')).toBe('true');
  });
});
