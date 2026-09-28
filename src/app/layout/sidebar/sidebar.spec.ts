import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { NavItem } from './nav-item';
import { Sidebar } from './sidebar';

@Component({ imports: [Sidebar], template: `<app-sidebar />` })
class HostComponent {}

const MERCHANT_ITEMS: readonly NavItem[] = [
  { label: 'الرئيسية', route: '/merchant/dashboard', icon: 'home' },
  { label: 'المنتجات', route: '/merchant/products', icon: 'package' },
];
const MERCHANT_SECONDARY_ITEMS: readonly NavItem[] = [
  { label: 'الإعدادات', route: '/merchant/settings', icon: 'settings' },
];

@Component({
  imports: [Sidebar],
  template: `<app-sidebar
    homeRoute="/merchant/dashboard"
    [navItems]="items"
    [secondaryNavItems]="secondaryItems"
  />`,
})
class MerchantHostComponent {
  protected readonly items = MERCHANT_ITEMS;
  protected readonly secondaryItems = MERCHANT_SECONDARY_ITEMS;
}

function collapseButton(fixture: { nativeElement: HTMLElement }): HTMLButtonElement {
  return fixture.nativeElement.querySelector('button[aria-controls="sidebar-nav"]')!;
}

describe('Sidebar', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideRouter([])] });
  });

  it('renders every nav item label', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('التقييمات و المراجعات');
    expect(text).toContain('المستخدمون');
  });

  it('shows the MapMob brand', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('MapMob');
  });

  it('starts expanded', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    expect(collapseButton(fixture).getAttribute('aria-expanded')).toBe('true');
  });

  it('hides the labels and the wordmark once the arrow is clicked', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    collapseButton(fixture).click();
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).not.toContain('المستخدمون');
    expect(text).not.toContain('MapMob');
    expect(collapseButton(fixture).getAttribute('aria-expanded')).toBe('false');
  });

  it('brings the labels back on a second click', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    collapseButton(fixture).click();
    fixture.detectChanges();
    collapseButton(fixture).click();
    fixture.detectChanges();

    expect(fixture.nativeElement.textContent).toContain('المستخدمون');
  });

  it('puts the wordmark before the arrow, so RTL lands the arrow on the left', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const header = collapseButton(fixture).parentElement!;
    const children = Array.from(header.children);
    expect(children.findIndex((child) => child.tagName === 'A')).toBeLessThan(
      children.findIndex((child) => child.tagName === 'BUTTON'),
    );
  });

  it('puts the icon before the label, so RTL lands the icon on the right edge', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const link: HTMLAnchorElement = fixture.nativeElement.querySelector('nav a');
    const children = Array.from(link.children);
    expect(children.findIndex((child) => child.tagName === 'APP-ICON')).toBeLessThan(
      children.findIndex((child) => child.tagName === 'SPAN'),
    );
  });

  it('keeps a title on every nav link while collapsed, so the icons stay readable', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    collapseButton(fixture).click();
    fixture.detectChanges();

    const firstLink: HTMLAnchorElement = fixture.nativeElement.querySelector('nav a');
    expect(firstLink.getAttribute('title')).toBe('الرئيسية');
  });

  it('draws the nav it is given and links the wordmark to the given home', () => {
    const fixture = TestBed.createComponent(MerchantHostComponent);
    fixture.detectChanges();

    const element: HTMLElement = fixture.nativeElement;
    expect(
      [...element.querySelectorAll('nav a')].map((link) => link.getAttribute('title')),
    ).toEqual(['الرئيسية', 'المنتجات', 'الإعدادات']);
    expect(element.querySelector('a[dir="ltr"]')!.getAttribute('href')).toBe('/merchant/dashboard');
  });
});
