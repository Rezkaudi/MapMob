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
});
