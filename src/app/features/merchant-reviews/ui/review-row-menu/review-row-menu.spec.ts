import { TestBed } from '@angular/core/testing';
import { ReviewRowMenu } from './review-row-menu';

function build(canReport: boolean) {
  const fixture = TestBed.createComponent(ReviewRowMenu);
  fixture.componentRef.setInput('canReport', canReport);
  fixture.detectChanges();
  const element: HTMLElement = fixture.nativeElement;
  element.querySelector<HTMLButtonElement>('button[aria-haspopup]')!.click();
  fixture.detectChanges();
  return { fixture, element };
}

function itemLabels(element: HTMLElement): string[] {
  return Array.from(element.querySelectorAll('[data-testid="action-menu-panel"] button')).map(
    (item) => item.textContent?.trim() ?? '',
  );
}

describe('ReviewRowMenu', () => {
  it('offers the details and a report', () => {
    const { fixture, element } = build(true);
    let viewCount = 0;
    let reportCount = 0;
    fixture.componentInstance.view.subscribe(() => viewCount++);
    fixture.componentInstance.report.subscribe(() => reportCount++);

    expect(itemLabels(element)).toEqual(['عرض التفاصيل', 'الإبلاغ عن مراجعة']);
    element
      .querySelectorAll<HTMLButtonElement>('[data-testid="action-menu-panel"] button')[1]
      .click();

    expect(reportCount).toBe(1);
    expect(viewCount).toBe(0);
  });

  it('leaves the report out once the review has been reported', () => {
    expect(itemLabels(build(false).element)).toEqual(['عرض التفاصيل']);
  });
});
