import { TestBed } from '@angular/core/testing';
import { PlaceDetailSkeleton } from './place-detail-skeleton';

describe('PlaceDetailSkeleton', () => {
  it('draws a placeholder for every block of the real page', () => {
    const fixture = TestBed.createComponent(PlaceDetailSkeleton);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(10);
  });
});
