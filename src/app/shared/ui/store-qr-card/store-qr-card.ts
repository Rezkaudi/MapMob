import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { STORE_QR_CAPTION, StoreQrSharing } from '../../browser/store-qr-sharing';
import { describeStoreQrCode } from '../../qr-code/store-qr-code';
import { CopiedNotice } from '../../state/copied-notice';
import { AppIcon } from '../app-icon/app-icon';

let nextCardNumber = 0;

/** "رمز المتجر": the scannable code of a store's public page, with copy, download and print. */
@Component({
  selector: 'app-store-qr-card',
  imports: [AppIcon],
  templateUrl: './store-qr-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreQrCard {
  readonly url = input.required<string>();
  readonly storeName = input.required<string>();

  private readonly sharing = inject(StoreQrSharing);

  protected readonly caption = STORE_QR_CAPTION;
  protected readonly idPrefix = `store-qr-${++nextCardNumber}`;
  protected readonly copiedNotice = new CopiedNotice();
  protected readonly code = computed(() => describeStoreQrCode(this.url(), this.storeName()));

  protected async copyLink(): Promise<void> {
    await this.sharing.copyLink(this.code());
    this.copiedNotice.show();
  }

  protected download(): Promise<void> {
    return this.sharing.download(this.code());
  }

  protected print(): Promise<void> {
    return this.sharing.print(this.code());
  }
}
