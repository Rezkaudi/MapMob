import { TestBed } from '@angular/core/testing';
import { WinnerRowMenu } from './winner-row-menu';

describe('WinnerRowMenu', () => {
  it('offers the winner details and a status change', () => {
    const fixture = TestBed.createComponent(WinnerRowMenu);
    fixture.detectChanges();
    fixture.nativeElement.querySelector('button').click();
    fixture.detectChanges();
    const items: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('[data-testid="action-menu-panel"] button'),
    );
    const picked: string[] = [];
    fixture.componentInstance.view.subscribe(() => picked.push('view'));
    fixture.componentInstance.statusChange.subscribe(() => picked.push('status'));

    expect(items.map((item) => item.textContent?.trim())).toEqual([
      'عرض تفاصيل الفائز',
      'تغيير الحالة',
    ]);
    items.forEach((item) => item.click());
    expect(picked).toEqual(['view', 'status']);
  });
});
