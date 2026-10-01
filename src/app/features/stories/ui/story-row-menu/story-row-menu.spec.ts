import { TestBed } from '@angular/core/testing';
import { StoryVisibilityAction } from '../../../../shared/models/story-visibility-action';
import { StoryRowMenu } from './story-row-menu';

function open(visibilityAction: StoryVisibilityAction | null) {
  const fixture = TestBed.createComponent(StoryRowMenu);
  fixture.componentRef.setInput('visibilityAction', visibilityAction);
  const picked: string[] = [];
  fixture.componentInstance.view.subscribe(() => picked.push('view'));
  fixture.componentInstance.visibilityChange.subscribe(() => picked.push('visibility'));
  fixture.componentInstance.remove.subscribe(() => picked.push('remove'));
  fixture.detectChanges();
  const element = fixture.nativeElement as HTMLElement;
  element.querySelector<HTMLElement>('button[aria-haspopup]')!.click();
  fixture.detectChanges();
  const items = () => [
    ...element.querySelectorAll<HTMLButtonElement>('[data-testid="action-menu-panel"] button'),
  ];
  return { fixture, element, items, picked };
}

const labelsOf = (items: HTMLButtonElement[]) => items.map((item) => item.textContent?.trim());

describe('StoryRowMenu', () => {
  it('opens the 192px sharp menu from the dark dots', () => {
    const { element } = open('hide');

    expect(element.querySelector('button[aria-haspopup]')?.getAttribute('aria-label')).toBe(
      'خيارات القصة',
    );
    const panel = element.querySelector('[data-testid="action-menu-panel"]')!;
    expect(panel.className).toContain('w-48');
    expect(panel.className).toContain('rounded-[2px]');
  });

  it('lists view, hide and delete for a running story, each led by its icon', () => {
    const { items } = open('hide');

    expect(labelsOf(items())).toEqual(['عرض القصة', 'إخفاء القصة', 'حذف القصة']);
    expect(items().every((item) => item.firstElementChild?.tagName === 'APP-ICON')).toBe(true);
  });

  it('offers to show a hidden story instead of hiding it', () => {
    expect(labelsOf(open('show').items())).toEqual(['عرض القصة', 'إظهار القصة', 'حذف القصة']);
  });

  it('leaves the visibility item out for a story that has run out', () => {
    expect(labelsOf(open(null).items())).toEqual(['عرض القصة', 'حذف القصة']);
  });

  it('rules off the delete item and paints only its bin red', () => {
    const { element, items } = open('hide');
    const remove = items().at(-1)!;

    expect(remove.previousElementSibling?.getAttribute('data-role')).toBe('menu-divider');
    expect(remove.querySelector('app-icon')?.classList).toContain('text-closed');
    expect(remove.classList).toContain('text-text-primary');
    expect(element.querySelectorAll('[data-role="menu-divider"]')).toHaveLength(1);
  });

  it('gives the item above the rule its 12px bottom padding, as the frame does', () => {
    expect(open('hide').items()[1].classList).toContain('pb-3');
    expect(open(null).items()[0].classList).toContain('pb-3');
  });

  it('reports each pick', () => {
    const { fixture, items, element, picked } = open('hide');
    const reopen = () => {
      element.querySelector<HTMLElement>('button[aria-haspopup]')!.click();
      fixture.detectChanges();
    };

    items()[0].click();
    reopen();
    items()[1].click();
    reopen();
    items()[2].click();

    expect(picked).toEqual(['view', 'visibility', 'remove']);
  });
});
