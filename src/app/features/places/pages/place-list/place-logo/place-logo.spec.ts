import { TestBed } from '@angular/core/testing';
import { PlaceLogo } from './place-logo';

describe('PlaceLogo', () => {
  it('falls back to the first letter when there is no logo', () => {
    const fixture = TestBed.createComponent(PlaceLogo);
    fixture.componentRef.setInput('name', 'صيدلية الحياة');
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent.trim()).toBe('ص');
    expect(fixture.nativeElement.querySelector('img')).toBeNull();
  });

  it('renders the logo when one is given', () => {
    const fixture = TestBed.createComponent(PlaceLogo);
    fixture.componentRef.setInput('name', 'صيدلية الحياة');
    fixture.componentRef.setInput('imageUrl', 'https://example.test/logo.png');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('img').getAttribute('src')).toBe(
      'https://example.test/logo.png',
    );
  });
});
