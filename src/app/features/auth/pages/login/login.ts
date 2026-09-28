import { ChangeDetectionStrategy, Component, computed, effect, inject, input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SegmentedChoice } from '../../../../shared/ui/segmented-choice/segmented-choice';
import { MerchantSignInForm } from '../../../merchant-auth/ui/merchant-sign-in-form/merchant-sign-in-form';
import {
  LOGIN_ROLE_CHOICES,
  LOGIN_ROLE_QUERY_PARAM,
  LoginRole,
  toLoginRole,
} from '../../models/login-role';
import { AuthStore } from '../../state/auth.store';
import { AdminSignInForm } from '../../ui/admin-sign-in-form/admin-sign-in-form';
import { AuthFormFrame } from '../../ui/auth-form-frame/auth-form-frame';

const ADMIN_HOME_ROUTE = '/admin/dashboard';
const MERCHANT_HOME_ROUTE = '/merchant/dashboard';

/** One sign-in page for both dashboards; the open tab lives in the URL as ?role=admin|merchant. */
@Component({
  selector: 'app-login',
  imports: [AdminSignInForm, AuthFormFrame, MerchantSignInForm, SegmentedChoice],
  templateUrl: './login.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Login {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authStore = inject(AuthStore);

  /** Bound from the `role` query parameter. */
  readonly role = input<string>();

  protected readonly activeRole = computed(() => toLoginRole(this.role()));
  protected readonly roleChoices = LOGIN_ROLE_CHOICES;

  constructor() {
    // A bare /login or an unknown role opens the admin tab; the URL is corrected to say so.
    effect(() => {
      if (this.role() !== this.activeRole()) {
        this.showRoleInUrl(this.activeRole());
      }
    });
    effect(() => {
      if (this.authStore.isMerchant()) {
        this.router.navigateByUrl(MERCHANT_HOME_ROUTE);
      } else if (this.authStore.isSignedIn()) {
        this.router.navigateByUrl(ADMIN_HOME_ROUTE);
      }
    });
  }

  protected selectRole(value: string | null): void {
    this.showRoleInUrl(toLoginRole(value));
  }

  // replaceUrl keeps tab flips out of the Back button's history.
  private showRoleInUrl(role: LoginRole): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { [LOGIN_ROLE_QUERY_PARAM]: role },
      replaceUrl: true,
    });
  }
}
