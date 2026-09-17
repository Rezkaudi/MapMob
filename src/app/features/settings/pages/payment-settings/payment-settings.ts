import { ChangeDetectionStrategy, Component, computed, inject } from '@angular/core';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { Toast } from '../../../../shared/ui/toast/toast';
import { PaymentMethodsStore } from '../../state/payment-methods.store';
import { PaymentMethodDialog } from '../../ui/payment-method-dialog/payment-method-dialog';
import { PaymentMethodTable } from '../../ui/payment-method-table/payment-method-table';
import { SettingsAddButton } from '../../ui/settings-add-button/settings-add-button';
import { SettingsSectionHeading } from '../../ui/settings-section-heading/settings-section-heading';

const SAVED_TITLES = {
  add: 'تمت إضافة بوابة الدفع',
  edit: 'تم تحديث بوابة الدفع',
};

@Component({
  selector: 'app-payment-settings',
  imports: [
    ErrorState,
    PaymentMethodDialog,
    PaymentMethodTable,
    SettingsAddButton,
    SettingsSectionHeading,
    Toast,
  ],
  templateUrl: './payment-settings.html',
  providers: [PaymentMethodsStore],
  host: { class: 'flex flex-col gap-6' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PaymentSettings {
  protected readonly store = inject(PaymentMethodsStore);
  protected readonly savedTitle = computed(() => {
    const mode = this.store.savedMode();
    return mode ? SAVED_TITLES[mode] : null;
  });

  constructor() {
    this.store.loadMethods();
  }
}
