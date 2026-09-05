import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import {
  Router,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError,
  Event as RouterEvent,
} from '@angular/router';
import { filter, map } from 'rxjs';

function isNavigationSettled(event: RouterEvent): boolean {
  return (
    event instanceof NavigationEnd ||
    event instanceof NavigationCancel ||
    event instanceof NavigationError
  );
}

/** The thin bar at the top of the shell that runs while a lazy page is being fetched. */
@Component({
  selector: 'app-route-progress',
  templateUrl: './route-progress.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class RouteProgress {
  private readonly router = inject(Router);

  protected readonly isNavigating = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationStart || isNavigationSettled(event)),
      map((event) => event instanceof NavigationStart),
    ),
    { initialValue: false },
  );
}
