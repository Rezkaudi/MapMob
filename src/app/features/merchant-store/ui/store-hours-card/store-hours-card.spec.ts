import { TestBed } from '@angular/core/testing';
import { toWorkingDayRows } from '../../state/working-day-rows';
import { buildWeek } from '../../testing/store-profile-fixture';
import { StoreHoursCard } from './store-hours-card';

function render(isOpen24Hours = false) {
  const fixture = TestBed.createComponent(StoreHoursCard);
  fixture.componentRef.setInput('rows', toWorkingDayRows(buildWeek()));
  fixture.componentRef.setInput('isOpen24Hours', isOpen24Hours);
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement };
}

describe('StoreHoursCard', () => {
  it('lists the seven days under its title, Saturday first', () => {
    const { element } = render();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('أوقات وساعات العمل');
    expect(element.querySelectorAll('li')).toHaveLength(7);
    expect(element.querySelector('li')?.textContent).toContain('السبت');
  });

  it('flips the "open 24 hours" switch from its label', () => {
    const { fixture, element } = render();
    const toggles: boolean[] = [];
    fixture.componentInstance.allDayToggled.subscribe((isOn) => toggles.push(isOn));

    const label = element.querySelector('label') as HTMLLabelElement;
    expect(label.textContent?.trim()).toBe('مفتوح 24 ساعة');
    (label.querySelector('[role="switch"]') as HTMLButtonElement).click();

    expect(toggles).toEqual([true]);
  });

  it('names the day a row changed', () => {
    const { fixture, element } = render();
    const closed: string[] = [];
    fixture.componentInstance.dayClosed.subscribe((day) => closed.push(day));

    (element.querySelectorAll('li > button')[1] as HTMLButtonElement).click();

    expect(closed).toEqual(['sunday']);
  });
});
