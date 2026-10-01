import { TestBed } from '@angular/core/testing';
import { StoryDetailView } from '../../models/story-detail-view';
import { StoryVisibilityAction } from '../../models/story-visibility-action';
import {
  buildExpiredStoryVisualCard,
  buildHiddenStoryVisualCard,
  buildStoryDetailView,
} from '../../testing/story-view-fixture';
import { StoryDetailDrawer } from './story-detail-drawer';

function build(
  detail: StoryDetailView = buildStoryDetailView(),
  visibilityAction: StoryVisibilityAction | null = null,
) {
  const fixture = TestBed.createComponent(StoryDetailDrawer);
  fixture.componentRef.setInput('detail', detail);
  fixture.componentRef.setInput('visibilityAction', visibilityAction);
  const events: string[] = [];
  fixture.componentInstance.remove.subscribe(() => events.push('remove'));
  fixture.componentInstance.visibilityChange.subscribe(() => events.push('visibility'));
  fixture.componentInstance.closed.subscribe(() => events.push('closed'));
  fixture.detectChanges();
  return { fixture, element: fixture.nativeElement as HTMLElement, events };
}

const rowsOf = (element: HTMLElement) =>
  [...element.querySelectorAll('[data-role="detail-row"]')].map((row) => [
    row.querySelector('dt')?.textContent?.trim(),
    row.querySelector('dd')?.textContent?.trim(),
  ]);

const footerButtons = (element: HTMLElement) => [
  ...element.querySelectorAll<HTMLButtonElement>('footer button'),
];

describe('StoryDetailDrawer', () => {
  it('opens the white 460px drawer named "عرض القصة"', () => {
    const { element } = build();

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('عرض القصة');
    expect(element.querySelector('[role="dialog"]')?.className).toContain('w-[460px]');
  });

  it('shows the story at 225px wide, as the customer sees it', () => {
    const { element } = build();
    const visual = element.querySelector('app-story-visual')!;

    expect(visual.className).toContain('w-[225px]');
    expect(visual.querySelector('[data-role="caption"]')?.className).toContain('text-[14px]');
    expect(visual.textContent).toContain('متبقي 14 ساعة');
  });

  it('lists the place, both dates, the views and the status', () => {
    expect(rowsOf(build().element)).toEqual([
      ['اسم المتجر', 'صيدلية الشفاء'],
      ['تاريخ النشر', '01/10/2026 - 10:30'],
      ['تاريخ الانتهاء', '02/10/2026 - 10:30'],
      ['المشاهدات', '125 مشاهدة'],
      ['الحالة', 'نشطة'],
    ]);
  });

  it('keeps each date left-to-right, so the day stays before the time', () => {
    const dates = [...build().element.querySelectorAll('[data-role="detail-row"] dd')].slice(1, 3);

    expect(dates.map((date) => date.getAttribute('dir'))).toEqual(['ltr', 'ltr']);
  });

  it('marks an active story green, a hidden one amber and an expired one grey', () => {
    const dot = (detail: StoryDetailView) =>
      build(detail).element.querySelector('[data-role="status-dot"]')!.className;

    expect(dot(buildStoryDetailView())).toContain('bg-status-success');
    expect(dot(buildStoryDetailView({ card: buildHiddenStoryVisualCard() }))).toContain(
      'bg-accent',
    );
    expect(dot(buildStoryDetailView({ card: buildExpiredStoryVisualCard() }))).toContain(
      'bg-text-secondary',
    );
  });

  it('asks to delete from the red button in the footer, the bin first on the right', () => {
    const { element, events } = build();
    const [button, ...others] = footerButtons(element);

    expect(others).toEqual([]);
    expect(button.textContent?.trim()).toBe('حذف القصة');
    expect(button.className).toContain('bg-closed');
    expect(button.firstElementChild?.tagName).toBe('APP-ICON');
    button.click();

    expect(events).toEqual(['remove']);
  });

  it('puts an outlined hide button first, so RTL draws it right of the delete button', () => {
    const { element, events } = build(buildStoryDetailView(), 'hide');
    const [hide, remove] = footerButtons(element);

    expect(hide.textContent?.trim()).toBe('إخفاء القصة');
    expect(hide.className).toContain('border-border');
    expect(hide.firstElementChild?.tagName).toBe('APP-ICON');
    expect(remove.textContent?.trim()).toBe('حذف القصة');
    hide.click();
    remove.click();

    expect(events).toEqual(['visibility', 'remove']);
  });

  it('offers to show a hidden story again', () => {
    const { element } = build(buildStoryDetailView({ card: buildHiddenStoryVisualCard() }), 'show');

    expect(footerButtons(element).map((button) => button.textContent?.trim())).toEqual([
      'إظهار القصة',
      'حذف القصة',
    ]);
  });

  it('closes from the cross', () => {
    const { element, events } = build();

    element.querySelector<HTMLButtonElement>('button[aria-label="إغلاق"]')!.click();

    expect(events).toEqual(['closed']);
  });
});
