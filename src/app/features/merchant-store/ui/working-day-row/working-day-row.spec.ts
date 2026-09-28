import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { WorkingDayRow as WorkingDayRowModel } from '../../models/working-day-row';
import { toWorkingDayRows } from '../../state/working-day-rows';
import { buildWeek } from '../../testing/store-profile-fixture';
import { WorkingDayRow } from './working-day-row';

@Component({
  imports: [WorkingDayRow],
  template: `<ul>
    <li
      app-working-day-row
      [row]="row()"
      [isOpen24Hours]="isOpen24Hours()"
      (opened)="events.push('opened')"
      (closed)="events.push('closed')"
      (timeChanged)="events.push($event.field + '=' + $event.time)"
    ></li>
  </ul>`,
})
class WorkingDayRowHost {
  readonly row = signal<WorkingDayRowModel>(toWorkingDayRows(buildWeek())[0]);
  readonly isOpen24Hours = signal(false);
  readonly events: string[] = [];
}

describe('WorkingDayRow', () => {
  function render(setUp: (host: WorkingDayRowHost) => void = () => undefined) {
    const fixture = TestBed.createComponent(WorkingDayRowHost);
    setUp(fixture.componentInstance);
    fixture.detectChanges();
    return { host: fixture.componentInstance, element: fixture.nativeElement as HTMLElement };
  }
  const texts = (root: Element) =>
    [...root.children].map((child) => child.textContent?.replace(/\s+/g, ' ').trim());

  it('reads right to left: the day, its hours from opening to closing, then the status', () => {
    const { element } = render();
    const row = element.querySelector('li') as HTMLElement;

    expect(texts(row)).toEqual(['السبت', '09:00 ص إلى 11:00 م', 'السبت: مفتوح']);
  });

  it('closes an open day from its green status button', () => {
    const { host, element } = render();
    const status = element.querySelector('li > button') as HTMLButtonElement;

    expect(status.getAttribute('aria-pressed')).toBe('true');
    // Holds its hidden day name, which would otherwise escape the scrolling page and widen it.
    expect(status.classList).toContain('relative');
    status.click();

    expect(host.events).toEqual(['closed']);
  });

  it('shows a closed day as a weekly holiday that can be switched back on', () => {
    const { host, element } = render((one) => one.row.set(toWorkingDayRows(buildWeek())[6]));
    const row = element.querySelector('li') as HTMLElement;

    expect(texts(row)).toEqual(['الجمعة', 'عطلة أسبوعية', 'الجمعة: تفعيل اليوم']);
    (element.querySelector('li > button') as HTMLButtonElement).click();
    expect(host.events).toEqual(['opened']);
  });

  it('passes on a new opening or closing time', () => {
    const { host, element } = render();
    const [opening, closing] = element.querySelectorAll('input[type="time"]');

    (opening as HTMLInputElement).value = '08:00';
    opening.dispatchEvent(new Event('change'));
    (closing as HTMLInputElement).value = '22:00';
    closing.dispatchEvent(new Event('change'));

    expect(host.events).toEqual(['openTime=08:00', 'closeTime=22:00']);
  });

  it('shows no hours on an open day while the store is open around the clock', () => {
    const { element } = render((one) => one.isOpen24Hours.set(true));

    expect(texts(element.querySelector('li') as HTMLElement)).toEqual([
      'السبت',
      'على مدار 24 ساعة',
      'السبت: مفتوح',
    ]);
  });
});
