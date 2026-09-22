import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogFrame } from './dialog-frame';

@Component({
  imports: [DialogFrame],
  template: `
    <app-dialog-frame
      heading="تفاصيل الإشعار"
      subheading="معاينة الإشعار"
      [headingIcon]="headingIcon()"
      [isBackVisible]="isBackVisible()"
      [appearance]="appearance()"
    >
      <p data-role="body">المحتوى</p>
      <button dialogFooter type="button">حفظ</button>
    </app-dialog-frame>
  `,
})
class HostComponent {
  readonly headingIcon = input<string | null>('notifications');
  readonly isBackVisible = input<boolean>(false);
  readonly appearance = input<'compact' | 'roomy'>('compact');
}

function render(
  inputs: {
    headingIcon?: string | null;
    isBackVisible?: boolean;
    appearance?: 'compact' | 'roomy';
  } = {},
) {
  const fixture = TestBed.createComponent(HostComponent);
  for (const [name, value] of Object.entries(inputs)) {
    fixture.componentRef.setInput(name, value);
  }
  fixture.detectChanges();
  const frame = fixture.debugElement.children[0].componentInstance as DialogFrame;
  return { fixture, element: fixture.nativeElement as HTMLElement, frame };
}

describe('DialogFrame', () => {
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

  it('gives the roomy card the wider chrome the payment frame draws', () => {
    const { element } = render({ appearance: 'roomy' });

    expect(element.querySelector('header')?.className).toContain('px-8');
    expect(element.querySelector('header')?.className).toContain('h-[92px]');
    expect(element.querySelector('[data-role="dialog-body"]')?.className).toContain('p-8');
  });

  it('keeps the compact card as the notification frames draw it', () => {
    const { element } = render();

    expect(element.querySelector('header')?.className).toContain('px-6');
    expect(element.querySelector('[data-role="dialog-body"]')?.className).toContain('p-6');
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
