import { TestBed } from '@angular/core/testing';
import { PlaceContactCard } from './place-contact-card';

const CONTACT = {
  phone: '+966 50 123 4567',
  whatsapp: '+966 50 123 4567',
  facebook: 'https://facebook.com/alhayatpharmacy',
  instagram: 'https://instagram.com/alhayatpharmacy',
};

describe('PlaceContactCard', () => {
  it('lists all four channels', () => {
    const fixture = TestBed.createComponent(PlaceContactCard);
    fixture.componentRef.setInput('contact', CONTACT);
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(fixture.nativeElement.querySelectorAll('a'));
    expect(links.length).toBe(4);
    expect(links[0].getAttribute('href')).toBe('tel:+966 50 123 4567');
    expect(links[1].getAttribute('href')).toBe('https://wa.me/966501234567');
  });
});
