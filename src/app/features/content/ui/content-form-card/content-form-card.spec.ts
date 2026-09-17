import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { ContentFormCard } from './content-form-card';

@Component({
  imports: [ContentFormCard],
  template: `<app-content-form-card><p>حقل</p></app-content-form-card>`,
})
class CardHost {}

describe('ContentFormCard', () => {
  it('wraps the fields in the white card, 32px apart', () => {
    const fixture = TestBed.createComponent(CardHost);
    fixture.detectChanges();
    const card = (fixture.nativeElement as HTMLElement).querySelector('section') as HTMLElement;

    expect(card.querySelector('p')?.textContent).toBe('حقل');
    expect(card.classList).toContain('rounded-2xl');
    expect(card.classList).toContain('gap-8');
  });
});
