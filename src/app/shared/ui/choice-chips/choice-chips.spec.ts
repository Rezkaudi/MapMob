import { TestBed } from '@angular/core/testing';
import { ChoiceChips } from './choice-chips';

const OPTIONS = [
  { value: null, label: 'الكل' },
  { value: 'active', label: 'نشط' },
  { value: 'draft', label: 'مسودة' },
];

function render(selected: string | null) {
  const fixture = TestBed.createComponent(ChoiceChips);
  fixture.componentRef.setInput('label', 'الحالة');
  fixture.componentRef.setInput('options', OPTIONS);
  fixture.componentRef.setInput('selected', selected);
  fixture.detectChanges();
  return fixture;
}

function chips(fixture: ReturnType<typeof render>): HTMLButtonElement[] {
  return Array.from((fixture.nativeElement as HTMLElement).querySelectorAll('button'));
}

describe('ChoiceChips', () => {
  it('lists the options in order, as a labelled group', () => {
    const fixture = render(null);

    expect(chips(fixture).map((chip) => chip.textContent?.trim())).toEqual([
      'الكل',
      'نشط',
      'مسودة',
    ]);
    expect(
      (fixture.nativeElement as HTMLElement)
        .querySelector('[role="radiogroup"]')
        ?.getAttribute('aria-label'),
    ).toBe('الحالة');
  });

  it('marks and fills only the picked chip', () => {
    const [all, active] = chips(render('active'));

    expect(active.getAttribute('aria-checked')).toBe('true');
    expect(active.className).toContain('bg-primary');
    expect(all.getAttribute('aria-checked')).toBe('false');
    expect(all.className).not.toContain('bg-primary');
  });

  it('emits the value of the chip that is clicked, null for "الكل"', () => {
    const fixture = render('active');
    const picked = vi.fn();
    fixture.componentInstance.selectedChange.subscribe(picked);

    chips(fixture)[2].click();
    chips(fixture)[0].click();

    expect(picked.mock.calls).toEqual([['draft'], [null]]);
  });

  it('can share one row equally, so a long group stays on one line', () => {
    const fixture = render(null);
    fixture.componentRef.setInput('layout', 'fill');
    fixture.detectChanges();
    const group = (fixture.nativeElement as HTMLElement).querySelector(
      '[role="radiogroup"]',
    ) as HTMLElement;

    expect(group.className).toContain('flex-nowrap');
    expect(chips(fixture).every((chip) => chip.className.includes('flex-1'))).toBe(true);
  });
});
