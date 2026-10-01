import { TestBed } from '@angular/core/testing';
import { StoryMenu } from './story-menu';

function open(canEdit: boolean) {
  const fixture = TestBed.createComponent(StoryMenu);
  fixture.componentRef.setInput('canEdit', canEdit);
  const picked: string[] = [];
  fixture.componentInstance.view.subscribe(() => picked.push('view'));
  fixture.componentInstance.edit.subscribe(() => picked.push('edit'));
  fixture.componentInstance.remove.subscribe(() => picked.push('remove'));
  fixture.detectChanges();
  (fixture.nativeElement as HTMLElement)
    .querySelector<HTMLElement>('button[aria-haspopup]')!
    .click();
  fixture.detectChanges();
  const items = () => [
    ...(fixture.nativeElement as HTMLElement).querySelectorAll<HTMLButtonElement>(
      '[data-testid="action-menu-panel"] button',
    ),
  ];
  return { fixture, items, picked };
}

describe('StoryMenu', () => {
  it('floats the dark tile over the picture and opens the narrow sharp menu', () => {
    const { fixture } = open(true);
    const element = fixture.nativeElement as HTMLElement;

    const trigger = element.querySelector('button[aria-haspopup]')!;
    expect(trigger.className).toContain('bg-black/40');
    expect(trigger.getAttribute('aria-label')).toBe('خيارات القصة');
    const panel = element.querySelector('[data-testid="action-menu-panel"]')!;
    expect(panel.className).toContain('w-[146px]');
    expect(panel.className).toContain('rounded-[2px]');
  });

  it('lists view, edit and delete for an active story, each led by its icon', () => {
    const { items } = open(true);

    expect(items().map((item) => item.textContent?.trim())).toEqual([
      'عرض القصة',
      'تعديل القصة',
      'حذف القصة',
    ]);
    expect(items().every((item) => item.firstElementChild?.tagName === 'APP-ICON')).toBe(true);
  });

  it('leaves edit out for an expired story', () => {
    const { items } = open(false);

    expect(items().map((item) => item.textContent?.trim())).toEqual(['عرض القصة', 'حذف القصة']);
  });

  it('says which item was picked', () => {
    const { fixture, items, picked } = open(true);

    items()[0].click();
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('button[aria-haspopup]')!
      .click();
    fixture.detectChanges();
    items()[1].click();
    fixture.detectChanges();
    (fixture.nativeElement as HTMLElement)
      .querySelector<HTMLElement>('button[aria-haspopup]')!
      .click();
    fixture.detectChanges();
    items()[2].click();

    expect(picked).toEqual(['view', 'edit', 'remove']);
  });
});
