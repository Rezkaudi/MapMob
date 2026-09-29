import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PlaceSelectFrame } from './place-select-frame';

@Component({
  imports: [PlaceSelectFrame],
  template: `<app-place-select-frame><select id="city"></select></app-place-select-frame>`,
})
class HostComponent {}

describe('PlaceSelectFrame', () => {
  it('keeps the select and pins the frame chevron 16px in from its left edge', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
    const frame: HTMLElement = fixture.nativeElement.querySelector('app-place-select-frame');

    expect(frame.querySelector('select#city')).not.toBeNull();
    const chevron = frame.querySelector('app-icon[data-role="select-chevron"]')!;
    expect(chevron.classList).toContain('left-4');
    expect(chevron.getAttribute('aria-hidden')).toBe('true');
  });
});
