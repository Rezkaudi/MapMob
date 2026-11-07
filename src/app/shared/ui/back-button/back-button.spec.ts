import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { Router, provideRouter } from '@angular/router';
import { BackButton } from './back-button';

@Component({ template: '' })
class BlankPage {}

function setUp() {
  TestBed.configureTestingModule({
    providers: [provideRouter([{ path: '**', component: BlankPage }])],
  });
  const router = TestBed.inject(Router);
  const location = TestBed.inject(Location);
  return { router, location };
}

function pressBack(): HTMLButtonElement {
  const fixture = TestBed.createComponent(BackButton);
  fixture.detectChanges();
  const button = fixture.nativeElement.querySelector('button') as HTMLButtonElement;
  button.click();
  return button;
}

describe('BackButton', () => {
  it('reads "الرجوع"', () => {
    setUp();
    const fixture = TestBed.createComponent(BackButton);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('button')?.textContent?.trim()).toBe('الرجوع');
  });

  it('goes back to the page the user came from', async () => {
    const { router, location } = setUp();
    await router.navigateByUrl('/admin/dashboard');
    await router.navigateByUrl('/admin/places');
    const back = vi.spyOn(location, 'back');

    pressBack();

    expect(back).toHaveBeenCalled();
  });

  it('opens the admin dashboard when the page was opened directly', async () => {
    const { router, location } = setUp();
    await router.navigateByUrl('/admin/places');
    const back = vi.spyOn(location, 'back');
    const navigate = vi.spyOn(router, 'navigateByUrl');

    pressBack();

    expect(back).not.toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith('/admin/dashboard');
  });

  it('opens the merchant dashboard when a merchant page was opened directly', async () => {
    const { router } = setUp();
    await router.navigateByUrl('/merchant/offers');
    const navigate = vi.spyOn(router, 'navigateByUrl');

    pressBack();

    expect(navigate).toHaveBeenCalledWith('/merchant/dashboard');
  });
});
