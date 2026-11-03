import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PlaceFormActions } from './place-form-actions';

function render(isBusy: boolean) {
  TestBed.configureTestingModule({ providers: [provideRouter([])] });
  const fixture = TestBed.createComponent(PlaceFormActions);
  fixture.componentRef.setInput('isBusy', isBusy);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}

describe('PlaceFormActions', () => {
  it('lets the place be saved while idle', () => {
    const element = render(false);

    const save = element.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(save.disabled).toBe(false);
    expect(save.querySelector('app-spinner')).toBeNull();
  });

  it('spins on save and takes every other way out of reach while saving', () => {
    const element = render(true);

    const save = element.querySelector('button[type="submit"]') as HTMLButtonElement;
    expect(save.disabled).toBe(true);
    expect(save.getAttribute('aria-busy')).toBe('true');
    expect(save.querySelector('app-spinner')).not.toBeNull();
    expect((element.querySelector('button[type="button"]') as HTMLButtonElement).disabled).toBe(
      true,
    );
    const cancel = element.querySelector('a') as HTMLAnchorElement;
    expect(cancel.getAttribute('aria-disabled')).toBe('true');
    expect(cancel.className).toContain('pointer-events-none');
  });
});
