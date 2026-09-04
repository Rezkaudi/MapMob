import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StarRating } from './star-rating';

@Component({
  imports: [StarRating],
  template: `<app-star-rating [value]="4.3" />`,
})
class HostComponent {}

describe('StarRating', () => {
  it('shows the numeric value', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('4.3');
  });

  it('renders one filled star per whole point, rounded to the nearest star', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const filled = fixture.nativeElement.querySelectorAll('svg[data-filled="true"]');
    expect(filled.length).toBe(4);
  });
});
