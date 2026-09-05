import { TestBed } from '@angular/core/testing';
import { BulkActionBar } from './bulk-action-bar';

describe('BulkActionBar', () => {
  it('shows how many rows are selected', () => {
    const fixture = TestBed.createComponent(BulkActionBar);
    fixture.componentRef.setInput('selectedCount', 2);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('عدد العناصر المحددة: 2');
  });

  it('emits the action behind each button', () => {
    const fixture = TestBed.createComponent(BulkActionBar);
    fixture.componentRef.setInput('selectedCount', 2);
    const fired: string[] = [];
    fixture.componentInstance.activate.subscribe(() => fired.push('activate'));
    fixture.componentInstance.remove.subscribe(() => fired.push('remove'));
    fixture.detectChanges();

    const buttons: HTMLButtonElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('button'),
    );
    buttons.find((button) => button.textContent?.includes('تفعيل'))?.click();
    buttons.find((button) => button.textContent?.includes('حذف'))?.click();

    expect(fired).toEqual(['activate', 'remove']);
  });
});
