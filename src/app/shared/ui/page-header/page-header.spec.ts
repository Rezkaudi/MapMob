import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { PageHeader } from './page-header';

@Component({
  imports: [PageHeader],
  template: `<app-page-header
    title="المستخدمين"
    description="إدارة المستخدمين"
    [isAddVisible]="false"
  >
    <button pageHeaderAction type="button">تصدير</button>
  </app-page-header>`,
})
class HostWithActionComponent {}

describe('PageHeader', () => {
  function render(isAddVisible: boolean) {
    const fixture = TestBed.createComponent(PageHeader);
    fixture.componentRef.setInput('title', 'المحافظات والمناطق');
    fixture.componentRef.setInput('description', 'إدارة المحافظات');
    fixture.componentRef.setInput('addLabel', 'إضافة محافظة');
    fixture.componentRef.setInput('isAddVisible', isAddVisible);
    fixture.detectChanges();
    return fixture;
  }

  it('shows the title and description', () => {
    const element = render(true).nativeElement as HTMLElement;

    expect(element.querySelector('h1')?.textContent?.trim()).toBe('المحافظات والمناطق');
    expect(element.textContent).toContain('إدارة المحافظات');
  });

  it('reports a press on the add button', () => {
    const fixture = render(true);
    const add = vi.fn();
    fixture.componentInstance.add.subscribe(add);

    (fixture.nativeElement.querySelector('button') as HTMLButtonElement).click();

    expect(add).toHaveBeenCalledOnce();
  });

  it('hides the add button when the page shows its own', () => {
    expect(render(false).nativeElement.querySelector('button')).toBeNull();
  });

  it('keeps the runs of spaces the design puts in a description', () => {
    const paragraph = render(true).nativeElement.querySelector('p') as HTMLElement;

    expect(paragraph.className).toContain('whitespace-pre-wrap');
  });

  it('shows a page-specific action in place of the add button', () => {
    const fixture = TestBed.createComponent(HostWithActionComponent);
    fixture.detectChanges();

    const buttons = Array.from(
      (fixture.nativeElement as HTMLElement).querySelectorAll('button'),
      (button) => button.textContent?.trim(),
    );
    expect(buttons).toEqual(['تصدير']);
  });
});
