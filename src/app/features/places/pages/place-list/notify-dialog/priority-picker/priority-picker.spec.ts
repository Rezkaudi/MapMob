import { TestBed } from '@angular/core/testing';
import { PriorityPicker } from './priority-picker';

describe('PriorityPicker', () => {
  it('lists the three priorities, right to left', () => {
    const fixture = TestBed.createComponent(PriorityPicker);
    fixture.componentRef.setInput('selected', 'general');
    fixture.detectChanges();

    const labels = Array.from(fixture.nativeElement.querySelectorAll('label')).map((label) =>
      (label as HTMLElement).textContent?.trim(),
    );
    expect(labels).toEqual(['عام (تحديثات)', 'مهم (تنبيه)', 'عاجل (طارئ)']);
  });

  it('marks the selected priority', () => {
    const fixture = TestBed.createComponent(PriorityPicker);
    fixture.componentRef.setInput('selected', 'urgent');
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('input:checked').value).toBe('urgent');
  });

  it('raises the priority the admin picks', () => {
    const fixture = TestBed.createComponent(PriorityPicker);
    fixture.componentRef.setInput('selected', 'general');
    fixture.detectChanges();

    const picked: string[] = [];
    fixture.componentInstance.selectedChange.subscribe((value) => picked.push(value));
    fixture.nativeElement.querySelectorAll('input')[1].click();

    expect(picked).toEqual(['important']);
  });
});
