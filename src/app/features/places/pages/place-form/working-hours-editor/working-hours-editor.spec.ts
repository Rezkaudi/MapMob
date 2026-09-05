import { TestBed } from '@angular/core/testing';
import { createDefaultWeek } from '../../../models/working-day';
import { WorkingHoursEditor } from './working-hours-editor';

describe('WorkingHoursEditor', () => {
  it('lists all seven days', () => {
    const fixture = TestBed.createComponent(WorkingHoursEditor);
    fixture.componentRef.setInput('week', createDefaultWeek());
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('li').length).toBe(7);
    expect(fixture.nativeElement.textContent).toContain('الجمعة');
  });

  it('disables both time fields on a closed day', () => {
    const fixture = TestBed.createComponent(WorkingHoursEditor);
    fixture.componentRef.setInput('week', [
      { day: 'السبت', isOpen: false, opensAt: '09:00', closesAt: '18:00' },
    ]);
    fixture.detectChanges();

    const times: HTMLInputElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('input[type="time"]'),
    );
    expect(times.every((input) => input.disabled)).toBe(true);
  });

  it('emits the whole week when a day is switched on', () => {
    const fixture = TestBed.createComponent(WorkingHoursEditor);
    fixture.componentRef.setInput('week', [
      { day: 'السبت', isOpen: false, opensAt: '09:00', closesAt: '18:00' },
    ]);
    let next: readonly { isOpen: boolean }[] = [];
    fixture.componentInstance.weekChange.subscribe((week) => (next = week));
    fixture.detectChanges();

    fixture.nativeElement.querySelector('button[role="switch"]').click();

    expect(next[0].isOpen).toBe(true);
  });
});
