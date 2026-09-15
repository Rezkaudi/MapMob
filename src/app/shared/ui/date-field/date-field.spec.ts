import { TestBed } from '@angular/core/testing';
import { DateField } from './date-field';

function render(value: string | null) {
  const fixture = TestBed.createComponent(DateField);
  fixture.componentRef.setInput('label', 'من تاريخ');
  fixture.componentRef.setInput('value', value);
  fixture.detectChanges();
  return fixture;
}

describe('DateField', () => {
  it('shows the picked day as the design writes it', () => {
    const element = render('2026-08-01').nativeElement as HTMLElement;

    expect(element.textContent).toContain('من تاريخ');
    expect(element.querySelector('[data-role="date-text"]')?.textContent?.trim()).toBe(
      '2026-08-01',
    );
    expect((element.querySelector('input') as HTMLInputElement).value).toBe('2026-08-01');
  });

  it('reports a new day, and null once cleared', () => {
    const fixture = render(null);
    const valueChange = vi.fn();
    fixture.componentInstance.valueChange.subscribe(valueChange);
    const input = fixture.nativeElement.querySelector('input') as HTMLInputElement;

    input.value = '2026-09-02';
    input.dispatchEvent(new Event('change'));
    input.value = '';
    input.dispatchEvent(new Event('change'));

    expect(valueChange.mock.calls).toEqual([['2026-09-02'], [null]]);
  });
});
