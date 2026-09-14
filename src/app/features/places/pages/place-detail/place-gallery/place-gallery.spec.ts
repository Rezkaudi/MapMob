import { TestBed } from '@angular/core/testing';
import { PlaceGallery } from './place-gallery';

function build(images: string[]) {
  const fixture = TestBed.createComponent(PlaceGallery);
  fixture.componentRef.setInput('images', images);
  fixture.componentRef.setInput('name', 'صيدلية الحياة');
  fixture.detectChanges();
  return fixture;
}

describe('PlaceGallery', () => {
  it('shows a placeholder when the place has no images', () => {
    expect(build([]).nativeElement.querySelectorAll('img').length).toBe(0);
  });

  it('shows the cover image and up to two thumbnails', () => {
    expect(
      build(['a.png', 'b.png', 'c.png', 'd.png']).nativeElement.querySelectorAll('img').length,
    ).toBe(3);
  });

  it('always offers the "أضف صورة" tile, as the design draws it', () => {
    for (const images of [[], ['a.png', 'b.png', 'c.png']]) {
      const fixture = build(images);
      const tile: HTMLElement = fixture.nativeElement.querySelector('[data-testid="add-image"]');

      expect(tile).toBeTruthy();
      expect(tile.textContent).toContain('أضف صورة');
    }
  });

  it('asks for an image when the tile is pressed', () => {
    const fixture = build([]);
    let asked = 0;
    fixture.componentInstance.addImage.subscribe(() => (asked += 1));

    (fixture.nativeElement.querySelector('[data-testid="add-image"]') as HTMLElement).click();

    expect(asked).toBe(1);
  });

  it('runs the strip left to right, so the add tile ends up last as in the design', () => {
    const strip: HTMLElement = build(['a.png', 'b.png', 'c.png']).nativeElement.querySelector(
      '[data-testid="image-strip"]',
    );

    // The page is RTL, where a plain flex row would put the add tile on the far left.
    expect(strip.className).toContain('flex-row-reverse');
  });
});
