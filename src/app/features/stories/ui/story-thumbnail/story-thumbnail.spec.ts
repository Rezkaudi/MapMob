import { TestBed } from '@angular/core/testing';
import { StoryThumbnail } from './story-thumbnail';

function render(imageUrl: string | null = 'https://cdn.example.com/story-1.jpg') {
  const fixture = TestBed.createComponent(StoryThumbnail);
  fixture.componentRef.setInput('imageUrl', imageUrl);
  fixture.componentRef.setInput('label', 'عرض قصة كافيه ورد');
  let openCount = 0;
  fixture.componentInstance.opened.subscribe(() => openCount++);
  fixture.detectChanges();
  const button = (fixture.nativeElement as HTMLElement).querySelector('button')!;
  return { button, openCount: () => openCount };
}

describe('StoryThumbnail', () => {
  it('draws the 40×61 dark tile with the picture under a play mark', () => {
    const { button } = render();

    expect(button.classList).toContain('w-10');
    expect(button.classList).toContain('h-[61px]');
    expect(button.querySelector('img')?.getAttribute('src')).toBe(
      'https://cdn.example.com/story-1.jpg',
    );
    expect(button.querySelector('[data-role="play-mark"] app-icon')).not.toBeNull();
  });

  it('keeps the dark tile and the play mark when there is no picture yet', () => {
    const { button } = render(null);

    expect(button.querySelector('img')).toBeNull();
    expect(button.querySelector('[data-role="play-mark"]')).not.toBeNull();
  });

  it('is a named button that opens the story', () => {
    const { button, openCount } = render();

    expect(button.getAttribute('aria-label')).toBe('عرض قصة كافيه ورد');
    button.click();

    expect(openCount()).toBe(1);
  });
});
