import { TestBed } from '@angular/core/testing';
import { FilterChips } from './filter-chips';

const OPTIONS = [
  { value: 'all', label: 'الكل', count: 120 },
  { value: 'active', label: 'نشط', count: 90, dotClass: 'bg-status-success' },
];

describe('FilterChips', () => {
  it('renders every chip with its count', () => {
    const fixture = TestBed.createComponent(FilterChips);
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.componentRef.setInput('selected', 'all');
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('الكل');
    expect(text).toContain('(120)');
    expect(text).toContain('نشط');
  });

  it('emits the value of the chip that was clicked', () => {
    const fixture = TestBed.createComponent(FilterChips);
    fixture.componentRef.setInput('options', OPTIONS);
    fixture.componentRef.setInput('selected', 'all');
    let picked = '';
    fixture.componentInstance.selectedChange.subscribe((value) => (picked = value));
    fixture.detectChanges();

    fixture.nativeElement.querySelectorAll('button')[1].click();

    expect(picked).toBe('active');
  });
});
