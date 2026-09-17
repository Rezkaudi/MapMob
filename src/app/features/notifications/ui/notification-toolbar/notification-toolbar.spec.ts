import { TestBed } from '@angular/core/testing';
import { NO_NOTIFICATION_FILTERS } from '../../models/notification-filters';
import { NotificationToolbar } from './notification-toolbar';

function render() {
  const fixture = TestBed.createComponent(NotificationToolbar);
  fixture.componentRef.setInput('filters', NO_NOTIFICATION_FILTERS);
  fixture.detectChanges();
  return fixture;
}

describe('NotificationToolbar', () => {
  it('searches notifications and keeps sort and "الفلاتر" 8px apart', () => {
    const element = render().nativeElement as HTMLElement;

    expect(element.querySelector('input')?.getAttribute('placeholder')).toBe('ابحث عن إشعار..');
    expect((element.querySelector('app-sort-select')?.parentElement as HTMLElement).style.gap).toBe(
      '8px',
    );
  });

  it('opens the notification filter panel and passes an applied filter on, closing the panel', () => {
    const fixture = render();
    const filtersApply = vi.fn();
    fixture.componentInstance.filtersApply.subscribe(filtersApply);
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('button[aria-controls]') as HTMLButtonElement).click();
    fixture.detectChanges();
    (
      Array.from(element.querySelectorAll('app-notification-filter-panel button')).find(
        (button) => button.textContent?.trim() === 'تطبيق الفلاتر',
      ) as HTMLButtonElement
    ).click();
    fixture.detectChanges();

    expect(filtersApply).toHaveBeenCalledWith(NO_NOTIFICATION_FILTERS);
    expect(element.querySelector('app-notification-filter-panel')).toBeNull();
  });
});
