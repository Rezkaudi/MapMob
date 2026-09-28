import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { Location } from '@angular/common';
import { RouterLink } from '@angular/router';

const ADMIN_HOME_ROUTE = '/admin/dashboard';

@Component({
  selector: 'app-not-found',
  imports: [RouterLink],
  templateUrl: './not-found.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotFound {
  private readonly location = inject(Location);

  /** Set from route data, so the merchant area links back to its own overview. */
  readonly homeRoute = input<string>(ADMIN_HOME_ROUTE);

  protected goBack(): void {
    this.location.back();
  }
}
