import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SettingsDialogField } from './settings-dialog-field';

@Component({
  imports: [SettingsDialogField],
  template: `
    <app-settings-dialog-field
      label="اسم المشرف بالكامل"
      fieldId="admin-name"
      [isRequired]="isRequired()"
      [error]="error()"
    >
      <input id="admin-name" />
    </app-settings-dialog-field>
  `,
})
class Host {
  readonly isRequired = input(true);
  readonly error = input<string | null>(null);
}

function render(inputs: Record<string, unknown> = {}) {
  const fixture = TestBed.createComponent(Host);
  Object.entries(inputs).forEach(([name, value]) => fixture.componentRef.setInput(name, value));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('SettingsDialogField', () => {
  it('labels the control and marks it required with the red star', () => {
    const element = render();

    expect(element.querySelector('label')?.getAttribute('for')).toBe('admin-name');
    expect(element.querySelector('label')?.textContent).toContain('اسم المشرف بالكامل');
    expect(element.querySelector('[data-role="required-star"]')?.textContent?.trim()).toBe('*');
  });

  it('leaves the star off an optional field', () => {
    expect(render({ isRequired: false }).querySelector('[data-role="required-star"]')).toBeNull();
  });

  it('shows the error under the control', () => {
    const element = render({ error: 'اكتب اسم المشرف' });

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('اكتب اسم المشرف');
  });
});
