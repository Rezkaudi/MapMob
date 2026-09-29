import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  Injector,
  afterNextRender,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ClipboardWriter } from '../../../../shared/browser/clipboard-writer';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ToggleSwitch } from '../../../../shared/ui/toggle-switch/toggle-switch';
import { DeliveryLinkRow } from '../../models/delivery-link-row';

const COPIED_NOTICE_MS = 2000;

@Component({
  selector: 'app-delivery-platform-item',
  imports: [AppIcon, ReactiveFormsModule, ToggleSwitch],
  templateUrl: './delivery-platform-item.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeliveryPlatformItem {
  readonly row = input.required<DeliveryLinkRow>();
  readonly urlControl = input.required<FormControl<string>>();
  readonly enabledChanged = output<boolean>();

  private readonly clipboard = inject(ClipboardWriter);
  private readonly injector = inject(Injector);
  private readonly urlInput = viewChild<ElementRef<HTMLInputElement>>('urlInput');
  private readonly isEditing = signal(false);
  private copiedNoticeTimer: ReturnType<typeof setTimeout> | undefined;

  protected readonly hasCopied = signal(false);
  protected readonly inputId = computed(() => `delivery-link-${this.row().platform.id}`);
  protected readonly isUrlEditable = computed(() => this.isEditing() || this.row().error !== null);

  constructor() {
    inject(DestroyRef).onDestroy(() => clearTimeout(this.copiedNoticeTimer));
  }

  protected toggle(isOn: boolean): void {
    this.enabledChanged.emit(isOn);
    if (isOn && this.row().storeUrl.trim() === '') {
      this.startEditing();
    }
  }

  protected startEditing(): void {
    this.isEditing.set(true);
    afterNextRender(() => this.urlInput()?.nativeElement.focus(), { injector: this.injector });
  }

  protected finishEditing(): void {
    if (this.urlControl().valid) {
      this.isEditing.set(false);
    }
  }

  protected async copyLink(): Promise<void> {
    await this.clipboard.write(this.row().storeUrl);
    this.hasCopied.set(true);
    clearTimeout(this.copiedNoticeTimer);
    this.copiedNoticeTimer = setTimeout(() => this.hasCopied.set(false), COPIED_NOTICE_MS);
  }
}
