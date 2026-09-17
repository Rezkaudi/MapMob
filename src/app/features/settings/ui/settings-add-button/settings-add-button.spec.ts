import { TestBed } from '@angular/core/testing';
import { SettingsAddButton } from './settings-add-button';

describe('SettingsAddButton', () => {
  it('shows its label with the plus and reports a press', () => {
    const fixture = TestBed.createComponent(SettingsAddButton);
    fixture.componentRef.setInput('label', 'إضافة بوابة دفع');
    let presses = 0;
    fixture.componentInstance.pressed.subscribe(() => presses++);
    fixture.detectChanges();
    const button = (fixture.nativeElement as HTMLElement).querySelector(
      'button',
    ) as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe('إضافة بوابة دفع');
    expect(button.querySelector('app-icon')).toBeTruthy();
    button.click();

    expect(presses).toBe(1);
  });
});
