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

  it('can be locked so it cannot be flipped', () => {
    const fixture = TestBed.createComponent(ToggleSwitch);
    fixture.componentRef.setInput('isOn', true);
    fixture.componentRef.setInput('isDisabled', true);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button').disabled).toBe(true);
  });
  it('draws the regular 44×24 switch unless asked for the small one', () => {
    const fixture = TestBed.createComponent(ToggleSwitch);
    fixture.componentRef.setInput('isOn', false);
    fixture.detectChanges();
    const button = () => fixture.nativeElement.querySelector('button') as HTMLButtonElement;

    expect(button().classList).toContain('w-11');

    fixture.componentRef.setInput('size', 'small');
    fixture.detectChanges();

    expect(button().classList).toContain('w-9');
    expect(button().classList).toContain('h-5');
    expect(button().classList).toContain('bg-[#d8dadc]');
  });
});
