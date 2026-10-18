import { TestBed } from '@angular/core/testing';
import { WinnerToolbar } from './winner-toolbar';

describe('WinnerToolbar', () => {
  it('heads the card, searches by name or phone and asks for the file', () => {
    const fixture = TestBed.createComponent(WinnerToolbar);
    fixture.detectChanges();
    const element: HTMLElement = fixture.nativeElement;
    const exported = vi.fn();
    let search = '';
    fixture.componentInstance.exportRequested.subscribe(exported);
    fixture.componentInstance.searchChange.subscribe((value) => (search = value));

    expect(element.querySelector('h2')?.textContent?.trim()).toBe('الفائزون وحالة تسليم الجوائز');
    const input = element.querySelector('input[type="search"]') as HTMLInputElement;
    expect(input.placeholder).toBe('ابحث باسم الفائز أو برقم الهاتف....');
    input.value = 'سارة';
    input.dispatchEvent(new Event('input'));
    (element.querySelector('[data-role="export"]') as HTMLButtonElement).click();

    expect(search).toBe('سارة');
    expect(exported).toHaveBeenCalled();
  });
});
