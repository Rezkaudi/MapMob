import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { NotificationDialogFrame } from './notification-dialog-frame';

@Component({
  imports: [NotificationDialogFrame],
  template: `
    <app-notification-dialog-frame
      heading="تفاصيل الإشعار"
      subheading="معاينة الإشعار"
      [headingIcon]="headingIcon()"
      [isBackVisible]="isBackVisible()"
    >
      <p data-role="body">المحتوى</p>
      <button dialogFooter type="button">حفظ</button>
    </app-notification-dialog-frame>
  `,
})
class HostComponent {
  readonly headingIcon = input<string | null>('notifications');
  readonly isBackVisible = input<boolean>(false);
}

function render(inputs: { headingIcon?: string | null; isBackVisible?: boolean } = {}) {
  const fixture = TestBed.createComponent(HostComponent);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  const frame = fixture.debugElement.children[0].componentInstance as NotificationDialogFrame;
  return { fixture, element: fixture.nativeElement as HTMLElement, frame };
}

describe('NotificationDialogFrame', () => {
  it('shows the heading, the icon tile, the body and the footer in their places', () => {
    const { element } = render();

    expect(element.querySelector('[role="dialog"] h2')?.textContent?.trim()).toBe('تفاصيل الإشعار');
    expect(element.textContent).toContain('معاينة الإشعار');
    expect(element.querySelector('header [data-role="icon-tile"]')).toBeTruthy();
    expect(element.querySelector('[data-role="dialog-body"] [data-role="body"]')).toBeTruthy();
    expect(element.querySelector('footer button')?.textContent?.trim()).toBe('حفظ');
  });

  it('closes from the cross, from outside the card and from Escape, but not from inside', () => {
    const { element, frame } = render();
    const closed = vi.fn();
    frame.closed.subscribe(closed);

    (element.querySelector('[data-role="dialog-body"]') as HTMLElement).click();
    expect(closed).not.toHaveBeenCalled();

    (element.querySelector('button[aria-label="إغلاق النافذة"]') as HTMLButtonElement).click();
    (element.querySelector('[role="dialog"]') as HTMLElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));

    expect(closed).toHaveBeenCalledTimes(3);
  });

  it('swaps the tile and the cross for a back arrow when asked', () => {
    const { element, frame } = render({ headingIcon: null, isBackVisible: true });
    const back = vi.fn();
    frame.back.subscribe(back);

    expect(element.querySelector('[data-role="icon-tile"]')).toBeNull();
    expect(element.querySelector('button[aria-label="إغلاق النافذة"]')).toBeNull();
    (element.querySelector('button[aria-label="رجوع"]') as HTMLButtonElement).click();

    expect(back).toHaveBeenCalledOnce();
  });
});
