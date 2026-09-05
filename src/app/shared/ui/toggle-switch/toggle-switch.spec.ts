import { TestBed } from '@angular/core/testing';
import { ToggleSwitch } from './toggle-switch';

describe('ToggleSwitch', () => {
  it('emits the flipped value when clicked', () => {
    const fixture = TestBed.createComponent(ToggleSwitch);
    fixture.componentRef.setInput('isOn', false);
    let next: boolean | null = null;
    fixture.componentInstance.toggled.subscribe((value) => (next = value));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button').click();

    expect(next).toBe(true);
  });

  it('reports its state to assistive tech', () => {
    const fixture = TestBed.createComponent(ToggleSwitch);
    fixture.componentRef.setInput('isOn', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').getAttribute('aria-checked')).toBe('true');
  });
});
