import { TestBed } from '@angular/core/testing';
import { PlaceDetailSkeleton } from './place-detail-skeleton';

describe('PlaceDetailSkeleton', () => {
  it('draws a placeholder for every block of the real page', () => {
    const fixture = TestBed.createComponent(PlaceDetailSkeleton);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(10);
  });

  it('starts the side column with a block the height of the QR card', () => {
    const fixture = TestBed.createComponent(PlaceDetailSkeleton);
    fixture.detectChanges();

    const first = fixture.nativeElement.querySelector(
      '[data-role="side-column"] app-skeleton',
    ) as HTMLElement;
    expect(first.style.height).toBe('417px');
  });
});
