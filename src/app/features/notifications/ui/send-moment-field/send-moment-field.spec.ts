import { TestBed } from '@angular/core/testing';
import { SendMomentField } from './send-moment-field';

function render(inputs: Record<string, unknown>) {
  const fixture = TestBed.createComponent(SendMomentField);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('SendMomentField', () => {
  it('shows a picked day month first and a picked time on a 12-hour clock', () => {
    const day = render({ kind: 'date', label: 'تاريخ الإرسال', value: '2026-05-18' });
    const time = render({ kind: 'time', label: 'وقت الإرسال', value: '20:00' });

    expect(day.element.querySelector('label')?.textContent).toContain('تاريخ الإرسال');
    expect(day.element.querySelector('[data-role="moment-text"]')?.textContent?.trim()).toBe(
      '05/18/2026',
    );
    expect(time.element.querySelector('[data-role="moment-text"]')?.textContent?.trim()).toBe(
      '08:00 PM',
    );
    expect(day.element.querySelector('input')?.type).toBe('date');
    expect(time.element.querySelector('input')?.type).toBe('time');
  });

  it('reports the picked value, and null once it is cleared', () => {
    const { fixture, element } = render({ kind: 'time', label: 'وقت الإرسال', value: null });
    const changes: (string | null)[] = [];
    fixture.componentInstance.valueChange.subscribe((value) => changes.push(value));
    const input = element.querySelector('input') as HTMLInputElement;

    input.value = '16:30';
    input.dispatchEvent(new Event('change'));
    input.value = '';
    input.dispatchEvent(new Event('change'));

    expect(changes).toEqual(['16:30', null]);
  });

  it('drops the icon in the filled look the reschedule frame uses', () => {
    const outlined = render({ kind: 'date', label: 'تاريخ', value: null });
    const filled = render({ kind: 'date', label: 'تاريخ', value: null, appearance: 'filled' });

    expect(outlined.element.querySelector('app-icon')).toBeTruthy();
    expect(filled.element.querySelector('app-icon')).toBeNull();
  });
});
