import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormField } from './form-field';

@Component({
  imports: [FormField],
  template: `
    <app-form-field
      label="اسم العرض"
      forId="offer-title"
      [isRequired]="true"
      [isLabelBold]="isLabelBold()"
      hint="سيتم استخدام هذا العنوان للتعريف بالعرض"
      [error]="error()"
      [counter]="counter()"
    >
      <input id="offer-title" />
    </app-form-field>
  `,
})
class HostComponent {
  readonly error = signal<string | null>(null);
  readonly isLabelBold = signal(false);
  readonly counter = signal('');
}

function render() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return fixture;
}

describe('FormField', () => {
  it('labels the control, marks it required and shows the hint', () => {
    const element = render().nativeElement as HTMLElement;
    const label = element.querySelector('label') as HTMLLabelElement;

    expect(label.getAttribute('for')).toBe('offer-title');
    expect(label.textContent?.replace(/\s+/g, ' ').trim()).toBe('اسم العرض *');
    expect(element.querySelector('input')).toBeTruthy();
    expect(element.textContent).toContain('سيتم استخدام هذا العنوان للتعريف بالعرض');
  });

  it('shows the error in place of the hint, and can bold the label', () => {
    const fixture = render();
    fixture.componentInstance.error.set('اكتب اسم العرض');
    fixture.componentInstance.isLabelBold.set(true);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    expect(element.querySelector('[role="alert"]')?.textContent?.trim()).toBe('اكتب اسم العرض');
    expect(element.textContent).not.toContain('سيتم استخدام هذا العنوان');
    expect(element.querySelector('label')?.className).toContain('font-bold');
  });

  it('puts the character counter on the far side of the label row', () => {
    const fixture = render();
    fixture.componentInstance.counter.set('60/0');
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;

    const row = element.querySelector('label')?.parentElement as HTMLElement;
    expect(row.className).toContain('justify-between');
    expect(row.lastElementChild?.textContent?.trim()).toBe('60/0');
  });
});
