import { TestBed } from '@angular/core/testing';
import { RadioDot } from './radio-dot';

function render(isChecked: boolean): HTMLElement {
  const fixture = TestBed.createComponent(RadioDot);
  fixture.componentRef.setInput('isChecked', isChecked);
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('[data-role="radio-dot"]');
}

describe('RadioDot', () => {
  it('draws a filled 18px blue dot when checked and a 16px grey ring when not', () => {
    expect(render(true).className).toContain('bg-primary');
    expect(render(true).className).toContain('size-[18px]');
    expect(render(false).className).toContain('border-[#6b7280]');
    expect(render(false).className).toContain('size-4');
  });
});
