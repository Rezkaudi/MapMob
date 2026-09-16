import { Component, signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { SideDrawer } from './side-drawer';

@Component({
  imports: [SideDrawer],
  template: `
    <app-side-drawer
      title="تفاصيل المراجعة والبلاغ"
      [hasAlertDot]="hasAlertDot()"
      [footerTone]="footerTone()"
      (closed)="closeCount = closeCount + 1"
    >
      <p data-testid="body">المحتوى</p>
      <button drawerFooter type="button">إجراء</button>
    </app-side-drawer>
  `,
})
class HostComponent {
  readonly hasAlertDot = signal(false);
  readonly footerTone = signal<'plain' | 'muted'>('plain');
  closeCount = 0;
}

function render(hasAlertDot = false) {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.componentInstance.hasAlertDot.set(hasAlertDot);
  fixture.detectChanges();
  return fixture;
}

describe('SideDrawer', () => {
  it('is a labelled modal dialog showing the body and the footer', () => {
    const element = render().nativeElement as HTMLElement;

    const dialog = element.querySelector('[role="dialog"]') as HTMLElement;
    expect(dialog.getAttribute('aria-modal')).toBe('true');
    const titleId = dialog.getAttribute('aria-labelledby') as string;
    expect(element.querySelector(`#${titleId}`)?.textContent?.trim()).toBe(
      'تفاصيل المراجعة والبلاغ',
    );
    expect(element.querySelector('[data-testid="body"]')).toBeTruthy();
    expect(element.querySelector('footer')?.textContent).toContain('إجراء');
  });

  it('shows the red dot before the title only when asked', () => {
    expect(render(false).nativeElement.querySelector('[data-role="alert-dot"]')).toBeNull();
    expect(render(true).nativeElement.querySelector('[data-role="alert-dot"]')).toBeTruthy();
  });

  it('closes from the cross, from Escape and from the dimmed backdrop, but not from inside', () => {
    const fixture = render();
    const element = fixture.nativeElement as HTMLElement;

    (element.querySelector('button[aria-label="إغلاق"]') as HTMLButtonElement).click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    (element.querySelector('[data-role="backdrop"]') as HTMLElement).click();
    (element.querySelector('[data-testid="body"]') as HTMLElement).click();

    expect(fixture.componentInstance.closeCount).toBe(3);
  });

  it('moves focus to the close button when it opens', () => {
    const fixture = TestBed.createComponent(HostComponent);
    const element = fixture.nativeElement as HTMLElement;
    document.body.appendChild(element);

    fixture.detectChanges();
    TestBed.tick();

    expect(document.activeElement?.getAttribute('aria-label')).toBe('إغلاق');
    element.remove();
  });

  it('paints the footer white by default, or grey with roomier padding for the offers drawer', () => {
    const fixture = render();
    const footer = () =>
      (fixture.nativeElement as HTMLElement).querySelector('footer') as HTMLElement;
    expect(footer().className).toContain('bg-white');

    fixture.componentInstance.footerTone.set('muted');
    fixture.detectChanges();

    expect(footer().className).toContain('bg-[#f2f4f6]');
    expect(footer().className).toContain('p-6');
  });
});
