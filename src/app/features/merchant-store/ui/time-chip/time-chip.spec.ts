import { TestBed } from '@angular/core/testing';
import { TimeChip } from './time-chip';

function render() {
  const fixture = TestBed.createComponent(TimeChip);
  fixture.componentRef.setInput('time', '09:00');
  fixture.componentRef.setInput('text', '09:00 ص');
  fixture.componentRef.setInput('label', 'وقت الفتح يوم السبت');
  fixture.detectChanges();
  const changes: string[] = [];
  fixture.componentInstance.timeChange.subscribe((time) => changes.push(time));
  return { element: fixture.nativeElement as HTMLElement, changes };
}

describe('TimeChip', () => {
  it('shows the time on a 12-hour clock and names what it sets', () => {
    const { element } = render();
    const button = element.querySelector('button') as HTMLButtonElement;

    expect(button.textContent?.trim()).toBe('09:00 ص');
    // A long day name squeezes the row; the time must stay on one line.
    expect(button.classList).toContain('whitespace-nowrap');
    expect(button.getAttribute('aria-label')).toBe('وقت الفتح يوم السبت: 09:00 ص');
  });

  it("opens the browser's time picker on click", () => {
    const { element } = render();
    const input = element.querySelector('input[type="time"]') as HTMLInputElement;
    const showPicker = vi.fn();
    Object.defineProperty(input, 'showPicker', { value: showPicker });

    (element.querySelector('button') as HTMLButtonElement).click();

    expect(input.value).toBe('09:00');
    expect(showPicker).toHaveBeenCalledOnce();
  });

  it('hands over the picked time', () => {
    const { element, changes } = render();
    const input = element.querySelector('input[type="time"]') as HTMLInputElement;

    input.value = '10:30';
    input.dispatchEvent(new Event('change'));

    expect(changes).toEqual(['10:30']);
  });
});
