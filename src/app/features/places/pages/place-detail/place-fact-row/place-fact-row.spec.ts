import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PlaceFactRow } from './place-fact-row';

@Component({
  imports: [PlaceFactRow],
  template: `<app-place-fact-row label="الحالة"
    ><span data-role="value">نشط</span></app-place-fact-row
  >`,
})
class HostComponent {}

describe('PlaceFactRow', () => {
  it('puts the label first, on the right, and the value on the left', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const row: HTMLElement = fixture.nativeElement.querySelector('[data-role="fact-row"]');
    const [label, value] = [...row.children];
    expect(row.classList).toContain('justify-between');
    expect(label.textContent?.trim()).toBe('الحالة');
    expect(value.textContent?.trim()).toBe('نشط');
  });
});
