import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { FormDialogFrame } from './form-dialog-frame';

@Component({
  imports: [FormDialogFrame],
  template: `
    <app-form-dialog-frame
      heading="إضافة وسائط"
      subheading="أضف صورة او فيديو جديداً لمكانك."
      (closed)="closedCount = closedCount + 1"
    >
      <p data-role="body-text">الحقول</p>
      <button formDialogFooter type="button">إلغاء</button>
    </app-form-dialog-frame>
  `,
})
class HostComponent {
  closedCount = 0;
}

@Component({
  imports: [FormDialogFrame],
  template: `<app-form-dialog-frame heading="تفاصيل المراجعة" appearance="notice" />`,
})
class NoticeHostComponent {}

function build() {
  const fixture = TestBed.createComponent(HostComponent);
  fixture.detectChanges();
  return fixture;
}

describe('FormDialogFrame', () => {
  it('names the dialog by its heading and shows the subheading', () => {
    const element: HTMLElement = build().nativeElement;
    const dialog = element.querySelector('[role="dialog"]')!;
    const title = element.querySelector(`#${dialog.getAttribute('aria-labelledby')}`);

    expect(title?.textContent?.trim()).toBe('إضافة وسائط');
    expect(element.textContent).toContain('أضف صورة او فيديو جديداً لمكانك.');
  });

  it('puts the projected body and footer in their places', () => {
    const element: HTMLElement = build().nativeElement;

    expect(
      element.querySelector('[data-role="dialog-body"] [data-role="body-text"]'),
    ).not.toBeNull();
    expect(element.querySelector('footer button')?.textContent).toContain('إلغاء');
  });

  it('closes from the cross, the backdrop and Escape, but not from a click inside', () => {
    const fixture = build();
    const element: HTMLElement = fixture.nativeElement;

    element.querySelector<HTMLElement>('[data-role="close-dialog"]')!.click();
    element.querySelector<HTMLElement>('[role="dialog"]')!.click();
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
    element.querySelector<HTMLElement>('[data-role="body-text"]')!.click();

    expect(fixture.componentInstance.closedCount).toBe(3);
  });

  it('draws a bold heading and leaves the line under it out when there is none', () => {
    const fixture = TestBed.createComponent(NoticeHostComponent);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;

    expect(element.querySelector('h2')?.className).toContain('font-bold');
    expect(element.querySelector('header p')).toBeNull();
  });
});
