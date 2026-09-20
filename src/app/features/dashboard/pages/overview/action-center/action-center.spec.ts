import { Component } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ActionItem } from '../../../models/action-item';
import { ActionCenter } from './action-center';

const ITEMS: readonly ActionItem[] = [
  { id: 'complaints', label: 'بلاغ جديد', count: 12, tone: 'error' },
  { id: 'pending-places', label: 'متجر بانتظار الموافقة', count: 37, tone: 'info' },
];

@Component({ imports: [ActionCenter], template: `<app-action-center [items]="items" />` })
class HostComponent {
  readonly items = ITEMS;
}

describe('ActionCenter', () => {
  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('shows the card heading and subtitle', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const text = fixture.nativeElement.textContent;
    expect(text).toContain('يحتاج إلى إجراء');
    expect(text).toContain('عناصر تحتاج إلى مراجعتك');
  });

  it('starts the heading and subtitle on the same side', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const titles: HTMLElement = fixture.nativeElement.querySelector('header div');
    expect(titles.className).toContain('items-start');
    expect(titles.className).not.toContain('items-end');
  });

  it('reads each row as a count followed by its label', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const rows = fixture.nativeElement.querySelectorAll('li');
    expect(rows.length).toBe(2);
    expect(rows[0].textContent).toContain('12 بلاغ جديد');
    expect(rows[1].textContent).toContain('37 متجر بانتظار الموافقة');
  });

  it('gives every row a review button', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const buttons = fixture.nativeElement.querySelectorAll('li [data-role="review"]');
    expect(buttons.length).toBe(2);
    expect(buttons[0].textContent.trim()).toBe('مراجعة');
  });

  it('sends each review button to the page that handles it', () => {
    const fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();

    const links: HTMLAnchorElement[] = Array.from(
      fixture.nativeElement.querySelectorAll('li [data-role="review"]'),
    );
    expect(links.map((link) => link.getAttribute('href'))).toEqual(['/complaints', '/places']);
  });

  it('leaves the review button out for an item with no page behind it', () => {
    const fixture = TestBed.createComponent(ActionCenter);
    fixture.componentRef.setInput('items', [
      { id: 'something-new', label: 'عنصر', count: 1, tone: 'info' },
    ]);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('li [data-role="review"]')).toBeNull();
  });
});

describe('ActionCenter while loading', () => {
  @Component({
    imports: [ActionCenter],
    template: `<app-action-center [items]="[]" [isLoading]="true" />`,
  })
  class HostLoadingComponent {}

  beforeEach(() => TestBed.configureTestingModule({ providers: [provideRouter([])] }));

  it('draws placeholder rows', () => {
    const fixture = TestBed.createComponent(HostLoadingComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelectorAll('app-skeleton').length).toBeGreaterThan(0);
  });
});
