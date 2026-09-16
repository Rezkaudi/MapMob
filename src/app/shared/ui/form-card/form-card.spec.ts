import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormCard } from './form-card';

@Component({
  imports: [FormCard],
  template: `<app-form-card heading="مكان وموضع الظهور" icon="map-pin-outline" [iconSize]="20">
    <p data-testid="fields">الحقول</p>
  </app-form-card>`,
})
class HostComponent {}

describe('FormCard', () => {
  it('heads the card with its icon and title over a line, then the projected fields', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const element = fixture.nativeElement as HTMLElement;
    const section = element.querySelector('section') as HTMLElement;

    expect(section.getAttribute('aria-labelledby')).toBe(element.querySelector('h2')?.id);
    expect(element.querySelector('h2')?.textContent?.trim()).toBe('مكان وموضع الظهور');
    expect(element.querySelector('header')?.className).toContain('border-b');
    expect(element.querySelector('header app-icon')).toBeTruthy();
    expect(element.querySelector('[data-testid="fields"]')).toBeTruthy();
  });
});
