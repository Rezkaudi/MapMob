import { TestBed } from '@angular/core/testing';
import { SegmentedChoice } from './segmented-choice';

const OPTIONS = [
  { value: 'new', label: 'اشتراك جديد' },
  { value: 'upgrade', label: 'ترقية باقة' },
  { value: 'renewal', label: 'تجديد اشتراك' },
];

function render(selected = 'new') {
  const fixture = TestBed.createComponent(SegmentedChoice);
  fixture.componentRef.setInput('label', 'نوع الدفعة');
  fixture.componentRef.setInput('options', OPTIONS);
  fixture.componentRef.setInput('selected', selected);
  fixture.detectChanges();
  return fixture;
}

function segmentsOf(element: HTMLElement): HTMLButtonElement[] {
  return Array.from(element.querySelectorAll('button'));
}

describe('SegmentedChoice', () => {
  it('lists the options in order, so RTL puts the first on the right', () => {
    const segments = segmentsOf(render().nativeElement);

    expect(segments.map((segment) => segment.textContent?.trim())).toEqual([
      'اشتراك جديد',
      'ترقية باقة',
      'تجديد اشتراك',
    ]);
  });

  it('raises only the chosen segment onto a white card', () => {
    const segments = segmentsOf(render('upgrade').nativeElement);

    expect(segments[1].getAttribute('aria-checked')).toBe('true');
    expect(segments[1].className).toContain('bg-white');
    expect(segments[1].className).toContain('text-primary');
    expect(segments[0].getAttribute('aria-checked')).toBe('false');
    expect(segments[0].className).not.toContain('bg-white');
  });

  it('names the group for a screen reader', () => {
    const group = render().nativeElement.querySelector('[role="radiogroup"]');

    expect(group.getAttribute('aria-label')).toBe('نوع الدفعة');
  });

  it('reports the picked option', () => {
    const fixture = render();
    const selectedChange = vi.fn();
    fixture.componentInstance.selectedChange.subscribe(selectedChange);

    segmentsOf(fixture.nativeElement)[2].click();

    expect(selectedChange).toHaveBeenCalledWith('renewal');
  });
});
