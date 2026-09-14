import { TestBed } from '@angular/core/testing';
import { RegionAddButton } from './region-add-button';

describe('RegionAddButton', () => {
  it('shows its label and reports a press', () => {
    const fixture = TestBed.createComponent(RegionAddButton);
    fixture.componentRef.setInput('label', 'إضافة محافظة');
    const pressed = vi.fn();
    fixture.componentInstance.pressed.subscribe(pressed);
    fixture.detectChanges();

    const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
    button.click();

    expect(button.textContent?.trim()).toBe('إضافة محافظة');
    expect(pressed).toHaveBeenCalledOnce();
  });
});
