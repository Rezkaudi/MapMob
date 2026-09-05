import { TestBed } from '@angular/core/testing';
import { PlaceLocationCard } from './place-location-card';

describe('PlaceLocationCard', () => {
  it('shows the city and the detailed address', () => {
    const fixture = TestBed.createComponent(PlaceLocationCard);
    fixture.componentRef.setInput('location', {
      city: 'طرطوس',
      address: 'طرطوس ، شارع الثورة، بجانب',
      latitude: 0,
      longitude: 0,
    });
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('طرطوس');
    expect(text).toContain('شارع الثورة');
  });
});
