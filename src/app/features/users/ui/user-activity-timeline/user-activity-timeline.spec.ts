import { TestBed } from '@angular/core/testing';
import { UserActivityTimeline } from './user-activity-timeline';

const ROWS = [
  {
    id: 'a1',
    description: 'بحث عن مطاعم',
    timeLabel: 'منذ 10 دقائق',
    icon: 'search-rounded',
    tileClass: 'bg-primary',
  },
  {
    id: 'a2',
    description: 'مشاركة رابط',
    timeLabel: 'منذ 3 أيام',
    icon: 'share',
    tileClass: 'bg-status-success',
  },
];

function render(rows: unknown[]) {
  const fixture = TestBed.createComponent(UserActivityTimeline);
  fixture.componentRef.setInput('rows', rows);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('UserActivityTimeline', () => {
  it('lists each activity with its time on a line joining the tiles', () => {
    const element = render(ROWS);
    const items = Array.from(element.querySelectorAll('li'));

    expect(
      items.map((item) => [
        item.querySelector('p')?.textContent?.trim(),
        item.querySelector('p + span')?.textContent?.trim(),
      ]),
    ).toEqual([
      ['بحث عن مطاعم', 'منذ 10 دقائق'],
      ['مشاركة رابط', 'منذ 3 أيام'],
    ]);
    expect(items[1].querySelector('.bg-status-success')).toBeTruthy();
    expect(element.querySelector('[data-role="timeline-line"]')).toBeTruthy();
  });

  it('says so when there is no activity', () => {
    const element = render([]);

    expect(element.textContent).toContain('لا يوجد نشاط حديث');
    expect(element.querySelector('[data-role="timeline-line"]')).toBeNull();
  });
});
