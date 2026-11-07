import { Location } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AppIcon } from '../app-icon/app-icon';

const ADMIN_HOME_ROUTE = '/admin/dashboard';
const MERCHANT_HOME_ROUTE = '/merchant/dashboard';
const MERCHANT_AREA_PREFIX = '/merchant';

/** Goes to the previous page, or to the dashboard when the page was opened directly. */
@Component({
  selector: 'app-back-button',
  imports: [AppIcon],
  templateUrl: './back-button.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackButton {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected goBack(): void {
    if (this.hasPreviousPage()) {
      this.location.back();
      return;
    }
    void this.router.navigateByUrl(this.homeRoute());
  }

  private hasPreviousPage(): boolean {
    return this.router.lastSuccessfulNavigation()?.previousNavigation != null;
  }

  private homeRoute(): string {
    return this.router.url.startsWith(MERCHANT_AREA_PREFIX)
      ? MERCHANT_HOME_ROUTE
      : ADMIN_HOME_ROUTE;
  }
}
