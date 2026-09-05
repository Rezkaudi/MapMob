import { TestBed } from '@angular/core/testing';
import { PlaceGallery } from './place-gallery';

describe('PlaceGallery', () => {
  it('shows a placeholder when the place has no images', () => {
    const fixture = TestBed.createComponent(PlaceGallery);
    fixture.componentRef.setInput('images', []);
    fixture.componentRef.setInput('name', 'صيدلية الحياة');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('img').length).toBe(0);
  });

  it('shows the cover image and up to two thumbnails', () => {
    const fixture = TestBed.createComponent(PlaceGallery);
    fixture.componentRef.setInput('images', ['a.png', 'b.png', 'c.png', 'd.png']);
    fixture.componentRef.setInput('name', 'صيدلية الحياة');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('img').length).toBe(3);
  });
});
