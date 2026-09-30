import { Component, input } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { DialogFrame } from './dialog-frame';

@Component({
  imports: [DialogFrame],
  template: `
    <app-dialog-frame
      heading="تفاصيل الإشعار"
      [subheading]="subheading()"
      [headingIcon]="headingIcon()"
      [isBackVisible]="isBackVisible()"
      [appearance]="appearance()"
      [hasFooter]="hasFooter()"
    >
      <p data-role="body">المحتوى</p>
      <button dialogFooter type="button">حفظ</button>
    </app-dialog-frame>
  `,
})
class HostComponent {
  readonly headingIcon = input<string | null>('notifications');
  readonly isBackVisible = input<boolean>(false);
  readonly appearance = input<'compact' | 'roomy' | 'slim' | 'light'>('compact');
  readonly subheading = input<string | null>('معاينة الإشعار');
  readonly hasFooter = input<boolean>(true);
}

function render(
  inputs: {
    headingIcon?: string | null;
    isBackVisible?: boolean;
    appearance?: 'compact' | 'roomy' | 'slim' | 'light';
    subheading?: string | null;
    hasFooter?: boolean;
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

  it("gives the slim card the subscription frames' 65px bar and a borderless footer", () => {
    const { element } = render({ appearance: 'slim', headingIcon: null });

    expect(element.querySelector('header')?.className).toContain('min-h-[65px]');
    expect(element.querySelector('[data-role="dialog-body"]')?.className).toContain('p-6');
    expect(element.querySelector('footer')?.className).not.toContain('border-t');
    expect(element.querySelector('footer')?.className).toContain('gap-3');
  });

  it("gives the light card the QR frame's 448px width, white header and pale footer", () => {
    const { element } = render({ appearance: 'light', headingIcon: null });
    const card = element.querySelector('header')?.parentElement;

    expect(card?.classList).toContain('max-w-md');
    expect(card?.classList).toContain('rounded-2xl');
    expect(element.querySelector('header')?.classList).toContain('bg-white');
    expect(element.querySelector('header')?.classList).not.toContain('bg-[#f2f4f6]');
    expect(element.querySelector('footer')?.classList).toContain('bg-surface-muted');
  });

  it('keeps the grey bars and the 576px card on the other frames', () => {
    const { element } = render();
    const card = element.querySelector('header')?.parentElement;

    expect(card?.classList).toContain('max-w-[576px]');
    expect(element.querySelector('header')?.classList).toContain('bg-[#f2f4f6]');
    expect(element.querySelector('footer')?.classList).toContain('bg-[#f2f4f6]');
  });

  it('leaves the line under the heading out when there is none', () => {
    const { element } = render({ subheading: null });

    expect(element.querySelector('header p')).toBeNull();
  });

  it('drops the footer bar for a read-only dialog', () => {
    const { element } = render({ hasFooter: false });

    expect(element.querySelector('footer')).toBeNull();
  });
});
