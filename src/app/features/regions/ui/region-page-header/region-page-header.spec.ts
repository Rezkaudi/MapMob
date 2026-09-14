import { TestBed } from '@angular/core/testing';
import { RegionPageHeader } from './region-page-header';

describe('RegionPageHeader', () => {
  function render(isAddVisible: boolean) {
    const fixture = TestBed.createComponent(RegionPageHeader);
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
});
