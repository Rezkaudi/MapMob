import { ChangeDetectionStrategy, Component, computed, inject, input, output } from '@angular/core';
import { StoreQrSharing } from '../../browser/store-qr-sharing';
import { describeStoreQrCode } from '../../qr-code/store-qr-code';
import { CopiedNotice } from '../../state/copied-notice';
import { AppIcon } from '../app-icon/app-icon';
import { DialogFrame } from '../dialog-frame/dialog-frame';

/** Clockwise from the top right, as RTL readers scan the box. */
const SCAN_CORNERS = [
  'top-3 right-3 rounded-tr-sm border-t-2 border-r-2',
  'bottom-3 right-3 rounded-br-sm border-b-2 border-r-2',
  'bottom-3 left-3 rounded-bl-sm border-b-2 border-l-2',
  'top-3 left-3 rounded-tl-sm border-t-2 border-l-2',
];

/** "رمز QR للمتجر": a store's code opened from a table row, with copy, download and print. */
@Component({
  selector: 'app-store-qr-dialog',
  imports: [AppIcon, DialogFrame],
  templateUrl: './store-qr-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreQrDialog {
  readonly url = input.required<string>();
  readonly storeName = input.required<string>();
  readonly closed = output<void>();

  private readonly sharing = inject(StoreQrSharing);

  protected readonly scanCorners = SCAN_CORNERS;
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
