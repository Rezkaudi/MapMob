import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NotFound } from './not-found';

describe('NotFound', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('says the page is missing', () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('404');
    expect(text).toContain('الصفحة غير موجودة');
  });

  it('offers a way back to the dashboard', () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector(
      'a[href="/admin/dashboard"]',
    );
    expect(link).toBeTruthy();
    expect(link.textContent!.trim()).toBe('العودة إلى الرئيسية');
  });

  it('links home to the route it is given, so the merchant area stays in its own dashboard', () => {
    const fixture = TestBed.createComponent(NotFound);
    fixture.componentRef.setInput('homeRoute', '/merchant/dashboard');
    fixture.detectChanges();

    const home: HTMLAnchorElement = fixture.nativeElement.querySelector('a');
    expect(home.getAttribute('href')).toBe('/merchant/dashboard');
  });
});
