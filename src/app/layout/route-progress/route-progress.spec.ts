import { TestBed } from '@angular/core/testing';
import { Router, NavigationStart, NavigationEnd, NavigationCancel, Event } from '@angular/router';
import { Subject } from 'rxjs';
import { RouteProgress } from './route-progress';

describe('RouteProgress', () => {
  let events: Subject<Event>;

  function createFixture() {
    events = new Subject<Event>();
    TestBed.configureTestingModule({
      providers: [{ provide: Router, useValue: { events } }],
    });
    const fixture = TestBed.createComponent(RouteProgress);
    fixture.detectChanges();
    return fixture;
  }

  it('shows no bar while the app sits still', () => {
    const fixture = createFixture();

    expect(fixture.nativeElement.querySelector('[data-role="bar"]')).toBeNull();
  });

  it('shows the bar while a page is loading', () => {
    const fixture = createFixture();

    events.next(new NavigationStart(1, '/places'));
    fixture.detectChanges();

    const bar: HTMLElement = fixture.nativeElement.querySelector('[data-role="bar"]');
    expect(bar).toBeTruthy();
    expect(bar.getAttribute('role')).toBe('progressbar');
  });

  it('hides the bar once the page has loaded', () => {
    const fixture = createFixture();

    events.next(new NavigationStart(1, '/places'));
    events.next(new NavigationEnd(1, '/places', '/places'));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-role="bar"]')).toBeNull();
  });

  it('hides the bar when a navigation is cancelled', () => {
    const fixture = createFixture();

    events.next(new NavigationStart(1, '/places'));
    events.next(new NavigationCancel(1, '/places', ''));
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('[data-role="bar"]')).toBeNull();
  });
});
