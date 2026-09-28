import { ChangeDetectionStrategy, Component } from '@angular/core';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { MERCHANT_AUTH_ROUTES } from '../../../merchant-auth/merchant-auth-paths';
import { AccountForms } from '../../../settings/ui/account-forms/account-forms';

/** The store owner's account: the admin's personal and password cards, without the settings tabs. */
@Component({
  selector: 'app-merchant-settings-page',
  imports: [AccountForms, PageHeader],
  templateUrl: './merchant-settings-page.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MerchantSettingsPage {
  protected readonly signOutUrl = MERCHANT_AUTH_ROUTES.login;
}
