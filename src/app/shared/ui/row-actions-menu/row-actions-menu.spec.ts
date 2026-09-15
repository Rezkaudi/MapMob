import { TestBed } from '@angular/core/testing';
import { RowActionsMenu } from './row-actions-menu';

function render() {
  const fixture = TestBed.createComponent(RowActionsMenu);
  fixture.detectChanges();
  return fixture;
}

function openPanel(fixture: ReturnType<typeof render>): HTMLElement {
  (fixture.nativeElement.querySelector('button[aria-haspopup]') as HTMLButtonElement).click();
  fixture.detectChanges();
  return fixture.nativeElement.querySelector('[data-testid="action-menu-panel"]');
}

function itemNamed(panel: HTMLElement, label: string): HTMLButtonElement {
  return Array.from(panel.querySelectorAll('button')).find(
    (button) => button.textContent?.trim() === label,
  ) as HTMLButtonElement;
}

describe('RowActionsMenu', () => {
  it('lists edit, change status and delete in the design order', () => {
    const panel = openPanel(render());

    const labels = Array.from(panel.querySelectorAll('button'), (button) =>
      button.textContent?.trim(),
    );
    expect(labels).toEqual(['تعديل', 'تغيير الحالة', 'حذف']);
  });

  it('can leave out "تغيير الحالة" for rows whose status changes elsewhere', () => {
    const fixture = render();
    fixture.componentRef.setInput('primaryAction', 'view');
    fixture.componentRef.setInput('isStatusChangeVisible', false);
    fixture.detectChanges();

    const labels = Array.from(openPanel(fixture).querySelectorAll('button'), (button) =>
      button.textContent?.trim(),
    );
    expect(labels).toEqual(['عرض التفاصيل', 'حذف']);
  });

  it('reports each pick', () => {
    const fixture = render();
    const edit = vi.fn();
    const statusChange = vi.fn();
    const remove = vi.fn();
    fixture.componentInstance.edit.subscribe(edit);
    fixture.componentInstance.statusChange.subscribe(statusChange);
    fixture.componentInstance.remove.subscribe(remove);

    itemNamed(openPanel(fixture), 'تعديل').click();
    itemNamed(openPanel(fixture), 'تغيير الحالة').click();
    itemNamed(openPanel(fixture), 'حذف').click();

    expect(edit).toHaveBeenCalledOnce();
    expect(statusChange).toHaveBeenCalledOnce();
    expect(remove).toHaveBeenCalledOnce();
  });

  it('leads with "عرض التفاصيل" and reports a view pick when it opens details', () => {
    const fixture = TestBed.createComponent(RowActionsMenu);
    fixture.componentRef.setInput('primaryAction', 'view');
    fixture.detectChanges();
    const view = vi.fn();
    const edit = vi.fn();
    fixture.componentInstance.view.subscribe(view);
    fixture.componentInstance.edit.subscribe(edit);

    const panel = openPanel(fixture);
    const labels = Array.from(panel.querySelectorAll('button'), (button) =>
      button.textContent?.trim(),
    );
    itemNamed(panel, 'عرض التفاصيل').click();

    expect(labels).toEqual(['عرض التفاصيل', 'تغيير الحالة', 'حذف']);
    expect(view).toHaveBeenCalledOnce();
    expect(edit).not.toHaveBeenCalled();
  });
});
