import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FilterPopover } from './filter-popover';

@Component({
  imports: [FilterPopover],
  template: `
    <app-filter-popover
      panelId="ad-filter-panel"
      heading="تصفية الإعلانات"
      [canApply]="canApply()"
      (applied)="log.push('apply')"
      (reset)="log.push('reset')"
      (closed)="log.push('close')"
    >
      <p data-testid="groups">المجموعات</p>
    </app-filter-popover>
  `,
})
class HostComponent {
  readonly canApply = signal(true);
  readonly log: string[] = [];
}

function render() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return fixture;
}

function buttonNamed(element: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(element.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('FilterPopover', () => {
  it('is a dialog named by its heading, around the projected groups', () => {
    const element = render().nativeElement as HTMLElement;
    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;

    expect(dialog.id).toBe('ad-filter-panel');
    expect(
      element.querySelector(`#${dialog.getAttribute('aria-labelledby')}`)?.textContent?.trim(),
    ).toBe('تصفية الإعلانات');
    expect(element.textContent).toContain('تطبيق معايير متعددة لتخصيص نتائج البحث');
    expect(element.querySelector('[data-testid="groups"]')).toBeTruthy();
  });

  it('reports apply, reset and close, and holds apply when it cannot', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;

    buttonNamed(element, 'تطبيق الفلاتر').click();
    buttonNamed(element, 'إعادة ضبط').click();
    (element.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement).click();
    expect(fixture.componentInstance.log).toEqual(['apply', 'reset', 'close']);

    fixture.componentInstance.canApply.set(false);
    fixture.detectChanges();
    expect(buttonNamed(element, 'تطبيق الفلاتر').disabled).toBe(true);
  });
});
