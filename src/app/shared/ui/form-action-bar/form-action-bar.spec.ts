import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormActionBar } from './form-action-bar';

function render(isBusy = false) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(FormActionBar);
  fixture.componentRef.setInput('saveLabel', 'حفظ العرض');
  fixture.componentRef.setInput('cancelLink', '/offers');
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

describe('FormActionBar', () => {
  it('orders save, draft and cancel from right to left', () => {
    const element = render().nativeElement as HTMLElement;
    const labels = Array.from(element.querySelectorAll('button, a'), (item) =>
      item.textContent?.trim(),
    );

    expect(labels).toEqual(['حفظ العرض', 'حفظ كمسودة', 'إلغاء']);
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/offers');
    expect(element.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('حفظ العرض');
  });

  it('asks for a draft save from its own button', () => {
    const fixture = render();
    const saveDraft = vi.fn();
    fixture.componentInstance.saveDraft.subscribe(saveDraft);

    (fixture.nativeElement.querySelector('button[type="button"]') as HTMLButtonElement).click();

    expect(saveDraft).toHaveBeenCalled();
  });

  it('holds both saves while one is running', () => {
    const buttons = Array.from(
      render(true).nativeElement.querySelectorAll('button'),
    ) as HTMLButtonElement[];

    expect(buttons.every((button) => button.disabled)).toBe(true);
  });
});
