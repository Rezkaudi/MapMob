import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { LucideStar } from '@lucide/angular';
import { StatCard } from './stat-card';

@Component({
  imports: [StatCard],
  template: `<app-stat-card [icon]="icon" label="إجمالي التقييمات" value="3,000" />`,
})
class HostComponent {
  readonly icon = LucideStar;
}

describe('StatCard', () => {
  it('renders the label and value', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('إجمالي التقييمات');
    expect(text).toContain('3,000');
  });
});
