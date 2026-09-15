import { TestBed } from '@angular/core/testing';
import { FilterSegmentedControl } from './filter-segmented-control';

const OPTIONS = [
  { value: null, label: 'الكل', tone: 'primary' },
  { value: 'active', label: 'نشط', tone: 'success' },
  { value: 'suspended', label: 'موقوف', tone: 'danger' },
];

function render(selected: string | null) {
  const fixture = TestBed.createComponent(FilterSegmentedControl);
  fixture.componentRef.setInput('label', 'حالة الحساب');
  fixture.componentRef.setInput('options', OPTIONS);
  fixture.componentRef.setInput('selected', selected);
  fixture.detectChanges();
  return fixture;
}

describe('FilterSegmentedControl', () => {
  it('lists the options as a radio group and marks the picked one', () => {
    const element = render('active').nativeElement as HTMLElement;
    const options = Array.from(element.querySelectorAll('[role="radio"]'));

    expect(element.querySelector('[role="radiogroup"]')?.getAttribute('aria-label')).toBe(
      'حالة الحساب',
    );
    expect(options.map((option) => option.textContent?.trim())).toEqual(['الكل', 'نشط', 'موقوف']);
    expect(options.map((option) => option.getAttribute('aria-checked'))).toEqual([
      'false',
      'true',
      'false',
    ]);
  });

  it('reports the picked value, with null for "الكل"', () => {
    const fixture = render('active');
    const selectedChange = vi.fn();
    fixture.componentInstance.selectedChange.subscribe(selectedChange);
    const options = fixture.nativeElement.querySelectorAll('[role="radio"]');

    options[2].click();
    options[0].click();

    expect(selectedChange.mock.calls).toEqual([['suspended'], [null]]);
  });
});
