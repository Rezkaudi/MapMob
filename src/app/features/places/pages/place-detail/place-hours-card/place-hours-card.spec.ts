import { TestBed } from '@angular/core/testing';
import { PlaceHoursCard } from './place-hours-card';

describe('PlaceHoursCard', () => {
  it('lists each day range and marks the place as open', () => {
    const fixture = TestBed.createComponent(PlaceHoursCard);
    fixture.componentRef.setInput('rows', [
      { days: 'الجمعة', hours: '04:00 PM - 11:00 PM', isToday: false },
    ]);
    fixture.componentRef.setInput('isOpenNow', true);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('مفتوح الآن');
    expect(text).toContain('الجمعة');
    expect(text).toContain('04:00 PM - 11:00 PM');
  });
});
