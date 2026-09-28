import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ADMIN_LOGIN_URL } from '../../../auth/models/login-role';
import { AccountForms } from '../../ui/account-forms/account-forms';
import { SettingsSectionHeading } from '../../ui/settings-section-heading/settings-section-heading';

const ADMIN_SIGN_OUT_DESCRIPTION = 'سيتم إنهاء الجلسة والعودة لشاشة الدخول الرئيسية للمشرفين.';

@Component({
  selector: 'app-account-settings',
  imports: [AccountForms, SettingsSectionHeading],
  templateUrl: './account-settings.html',
  host: { class: 'flex flex-col gap-6' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountSettings {
  protected readonly signOutUrl = ADMIN_LOGIN_URL;
  protected readonly signOutDescription = ADMIN_SIGN_OUT_DESCRIPTION;
}
