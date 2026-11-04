import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { FormActionBar } from './form-action-bar';

function render(isBusy = false) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(FormActionBar);
  fixture.componentRef.setInput('saveLabel', 'حفظ العرض');
  fixture.componentRef.setInput('cancelLink', '/admin/offers');
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture;
}

describe('FormActionBar', () => {
  it('shows only save and cancel, right to left, with no draft button', () => {
    const element = render().nativeElement as HTMLElement;
    const labels = Array.from(element.querySelectorAll('button, a'), (item) =>
      item.textContent?.trim(),
    );

    expect(labels).toEqual(['حفظ العرض', 'إلغاء']);
    expect(element.querySelector('a')?.getAttribute('href')).toBe('/admin/offers');
    expect(element.querySelector('button[type="submit"]')?.textContent?.trim()).toBe('حفظ العرض');
  });

  it('spins on the save button and takes cancel out of reach while saving', () => {
    const element = render(true).nativeElement as HTMLElement;

    const save = element.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    expect(save.querySelector('app-spinner')).not.toBeNull();
    const cancel = element.querySelector('a') as HTMLAnchorElement;
    expect(cancel.getAttribute('aria-disabled')).toBe('true');
    expect(cancel.getAttribute('tabindex')).toBe('-1');
    expect(cancel.className).toContain('pointer-events-none');
  });
});
