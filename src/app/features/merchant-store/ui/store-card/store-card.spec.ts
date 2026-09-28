import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreCard } from './store-card';

@Component({
  imports: [StoreCard],
  template: `<section appStoreCard class="rounded-xl p-6"></section>`,
})
class StoreCardHost {}

describe('StoreCard', () => {
  it('draws the white card with its inside 1px border and soft shadow', () => {
    const fixture = TestBed.createComponent(StoreCardHost);
    fixture.detectChanges();
    const card = fixture.nativeElement.querySelector('section') as HTMLElement;

    expect(card.classList).toContain('bg-white');
    expect(card.classList).toContain('outline-border');
    expect(card.classList).toContain('-outline-offset-1');
    expect(card.classList).toContain('rounded-xl');
  });
});
