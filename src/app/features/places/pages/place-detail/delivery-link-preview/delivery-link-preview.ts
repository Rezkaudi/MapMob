import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  signal,
} from '@angular/core';
import { ClipboardWriter } from '../../../../../shared/browser/clipboard-writer';
import { DeliveryLink } from '../../../../../shared/models/delivery-link';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';

const COPIED_NOTICE_MS = 2000;

/** One switched-on ordering app on the detail page: its name, its link, open and copy. */
@Component({
  selector: 'app-delivery-link-preview',
  imports: [AppIcon],
  templateUrl: './delivery-link-preview.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryLinkPreview {
  readonly link = input.required<DeliveryLink>();

  private readonly clipboard = inject(ClipboardWriter);
  private copiedNoticeTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly hasCopied = signal(false);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copiedNoticeTimer));
  }

  protected async copyLink(): Promise<void> {
    await this.clipboard.write(this.link().storeUrl ?? '');
    this.hasCopied.set(true);
    clearTimeout(this.copiedNoticeTimer);
    this.copiedNoticeTimer = setTimeout(() => this.hasCopied.set(false), COPIED_NOTICE_MS);
  }
}
