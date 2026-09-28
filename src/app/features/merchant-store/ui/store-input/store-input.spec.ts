import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { StoreInput } from './store-input';

@Component({
  imports: [StoreInput],
  template: `<input appStoreInput class="h-11" /><input appStoreInput isLatin /><textarea
      appStoreInput
      isMuted
    ></textarea>`,
})
class StoreInputHost {}

describe('StoreInput', () => {
  it('gives the control the grey rounded field look and keeps its own classes', () => {
    const fixture = TestBed.createComponent(StoreInputHost);
    fixture.detectChanges();
    const [arabic] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];

    expect(arabic.classList).toContain('bg-[#f2f4f6]');
    expect(arabic.classList).toContain('rounded-lg');
    expect(arabic.classList).toContain('h-11');
    expect(arabic.getAttribute('dir')).toBeNull();
  });

  it('writes Latin values left to right, starting at the left edge', () => {
    const fixture = TestBed.createComponent(StoreInputHost);
    fixture.detectChanges();
    const [, latin] = fixture.nativeElement.querySelectorAll('input') as HTMLInputElement[];

    expect(latin.getAttribute('dir')).toBe('ltr');
    expect(latin.classList).toContain('text-left');
  });
  it('writes in the text colour, or in grey when muted as the description is', () => {
    const fixture = TestBed.createComponent(StoreInputHost);
    fixture.detectChanges();
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;
    const textarea = fixture.nativeElement.querySelector('textarea') as HTMLTextAreaElement;

    expect(input.classList).toContain('text-text-primary');
    expect(textarea.classList).toContain('text-text-secondary');
    expect(textarea.classList).not.toContain('text-text-primary');
  });
});
