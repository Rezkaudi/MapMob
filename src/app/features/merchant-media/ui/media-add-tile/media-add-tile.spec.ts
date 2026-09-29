import { TestBed } from '@angular/core/testing';
import { MediaAddTile } from './media-add-tile';

describe('MediaAddTile', () => {
  it('shows the dashed add card and asks to add on click', () => {
    const fixture = TestBed.createComponent(MediaAddTile);
    fixture.detectChanges();
    let pressedCount = 0;
    fixture.componentInstance.pressed.subscribe(() => pressedCount++);

    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    expect(button.textContent).toContain('إضافة وسائط جديدة');
    expect(button.textContent).toContain('(صورة/فيديو)');
    button.click();

    expect(pressedCount).toBe(1);
  });
});
