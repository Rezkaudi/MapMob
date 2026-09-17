import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SettingsField } from './settings-field';

@Component({
  imports: [SettingsField],
  template: `
    <app-settings-field
      label="الاسم الكامل"
      fieldId="full-name"
      [icon]="icon()"
      [iconPlacement]="iconPlacement()"
      [error]="error()"
    >
      <input id="full-name" />
    </app-settings-field>
  `,
})
class Host {
  readonly icon = input<string | null>(null);
  readonly error = input<string | null>(null);
  readonly iconPlacement = input<'field' | 'chevron'>('field');
}

function render(inputs: { icon?: string; error?: string; iconPlacement?: string } = {}) {
  const fixture = TestBed.createComponent(Host);
  Object.entries(inputs).forEach(([name, value]) => fixture.componentRef.setInput(name, value));
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('SettingsField', () => {
  it('labels the projected control', () => {
    const element = render();

    const label = element.querySelector('label');
    expect(label?.textContent?.trim()).toBe('الاسم الكامل');
    expect(label?.getAttribute('for')).toBe('full-name');
    expect(element.querySelector('input#full-name')).toBeTruthy();
    expect(element.querySelector('app-icon')).toBeNull();
  });

  it('draws the field icon when there is one', () => {
    const element = render({ icon: 'settings-user' });

    expect(element.querySelector('app-icon')).toBeTruthy();
  });

  it('insets a field icon 12px from the left edge, and a select chevron 16px', () => {
    expect(render({ icon: 'settings-user' }).querySelector('app-icon')?.classList).toContain(
      'left-3',
    );
    expect(
      render({ icon: 'chevron-left-thin', iconPlacement: 'chevron' }).querySelector('app-icon')
        ?.classList,
    ).toContain('left-4');
  });

  it('shows the error under the control', () => {
    const element = render({ error: 'اكتب الاسم الكامل' });

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('اكتب الاسم الكامل');
  });
});
