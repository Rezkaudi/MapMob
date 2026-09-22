import { TestBed } from '@angular/core/testing';
import { CategoryColorPicker } from './category-color-picker';

function render() {
  const fixture = TestBed.createComponent(CategoryColorPicker);
  fixture.componentRef.setInput('value', '#0583EC');
  fixture.detectChanges();
  return fixture;
}

function buttonsOf(element: HTMLElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('button'));
}

describe('CategoryColorPicker', () => {
  it('draws every swatch in its own colour', () => {
    const buttons = buttonsOf(render().nativeElement);

    expect(buttons).toHaveLength(13);
    expect(buttons[0].style.backgroundColor).toBe('rgb(255, 129, 4)');
  });

  it('marks the current colour and hides the tick on the others', () => {
    const buttons = buttonsOf(render().nativeElement);

    expect(buttons[7].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[0].querySelector('svg')).toBeNull();
  });

  it('draws the tick inline, so it never depends on an asset request', () => {
    const tick = buttonsOf(render().nativeElement)[7].querySelector('svg');

    expect(tick).not.toBeNull();
    expect(tick?.querySelector('path')).not.toBeNull();
  });

  it('reports the picked colour', () => {
    const fixture = render();
    const valueChange = vi.fn();
    fixture.componentInstance.valueChange.subscribe(valueChange);

    buttonsOf(fixture.nativeElement)[12].click();

    expect(valueChange).toHaveBeenCalledWith('#D141DF');
  });
});
