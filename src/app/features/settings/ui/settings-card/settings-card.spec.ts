import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SettingsCard, SettingsCardSpacing } from './settings-card';

@Component({
  imports: [SettingsCard],
  template: `
    <app-settings-card title="المعلومات الشخصية" [spacing]="spacing()">
      <span settingsCardBadge>Super Admin</span>
      <p>المحتوى</p>
    </app-settings-card>
  `,
})
class Host {
  readonly spacing = input<SettingsCardSpacing>('regular');
}

function render(spacing: SettingsCardSpacing = 'regular') {
  const fixture = TestBed.createComponent(Host);
  fixture.componentRef.setInput('spacing', spacing);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('section') as HTMLElement;
}

describe('SettingsCard', () => {
  it('heads the card with its title and puts the badge in the header', () => {
    const card = render();

    expect(card.querySelector('header h3')?.textContent?.trim()).toBe('المعلومات الشخصية');
    expect(card.querySelector('header')?.lastElementChild?.textContent?.trim()).toBe('Super Admin');
    expect(card.querySelector('header + div p')?.textContent).toBe('المحتوى');
  });

  it('leaves 16px under the header, or 24px when roomy', () => {
    expect(render('regular').classList).toContain('gap-4');
    expect(render('roomy').classList).toContain('gap-6');
  });
});
