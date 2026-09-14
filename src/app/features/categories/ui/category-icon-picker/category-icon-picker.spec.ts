import { TestBed } from '@angular/core/testing';
import { CategoryIconPicker } from './category-icon-picker';

function render() {
  const fixture = TestBed.createComponent(CategoryIconPicker);
  fixture.componentRef.setInput('value', 'utensils');
  fixture.detectChanges();
  return fixture;
}

function buttonsOf(element: HTMLElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('button'));
}

describe('CategoryIconPicker', () => {
  it('offers the ten icons and marks the current one', () => {
    const buttons = buttonsOf(render().nativeElement);

    expect(buttons).toHaveLength(10);
    expect(buttons[0].getAttribute('aria-pressed')).toBe('true');
    expect(buttons[0].className).toContain('border-primary');
    expect(buttons[1].getAttribute('aria-pressed')).toBe('false');
    expect(buttons[1].getAttribute('aria-label')).toBe('مقاهي');
  });

  it('reports the picked icon', () => {
    const fixture = render();
    const valueChange = vi.fn();
    fixture.componentInstance.valueChange.subscribe(valueChange);

    buttonsOf(fixture.nativeElement)[9].click();

    expect(valueChange).toHaveBeenCalledWith('gift');
  });
});
