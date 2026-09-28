import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreField } from './store-field';

@Component({
  imports: [StoreField],
  template: `
    <app-store-field
      label="اسم المتجر التجاري"
      forId="store-name"
      [isRequired]="isRequired()"
      [counter]="counter()"
      [error]="error()"
      [icon]="icon()"
    >
      <input id="store-name" />
    </app-store-field>
  `,
})
class StoreFieldHost {
  readonly isRequired = signal(false);
  readonly counter = signal('');
  readonly error = signal<string | null>(null);
  readonly icon = signal<string | null>(null);
}

describe('StoreField', () => {
  function render(setUp: (host: StoreFieldHost) => void = () => undefined) {
    const fixture = TestBed.createComponent(StoreFieldHost);
    setUp(fixture.componentInstance);
    fixture.detectChanges();
    return fixture.nativeElement as HTMLElement;
  }

  it('labels the projected control', () => {
    const element = render();
    const label = element.querySelector('label');

    expect(label?.textContent?.trim()).toBe('اسم المتجر التجاري');
    expect(label?.getAttribute('for')).toBe('store-name');
    expect(element.querySelector('input#store-name')).toBeTruthy();
  });

  it('puts the red star after the label text, so RTL draws it on the left', () => {
    const element = render((host) => host.isRequired.set(true));
    const parts = [...(element.querySelector('label')?.children ?? [])];

    expect(parts.map((part) => part.textContent?.trim())).toEqual(['اسم المتجر التجاري', '*']);
  });

  it('shows the character counter left to right', () => {
    const element = render((host) => host.counter.set('300/124'));
    const counter = element.querySelector('[data-role="counter"]');

    expect(counter?.textContent?.trim()).toBe('300/124');
    expect(counter?.getAttribute('dir')).toBe('ltr');
  });

  it('draws the icon inside the control and the error under it', () => {
    const element = render((host) => {
      host.icon.set('phone-feather');
      host.error.set('أدخل رقم هاتف صحيح');
    });

    // `start` is the right edge in RTL, where the frame draws every field icon.
    expect(element.querySelector('app-icon')?.classList).toContain('start-3');
    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('أدخل رقم هاتف صحيح');
  });
});
