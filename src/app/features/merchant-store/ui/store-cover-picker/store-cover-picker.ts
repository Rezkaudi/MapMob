import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  linkedSignal,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { PICTURE_RULES } from '../../../../shared/files/picture-rules';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { findFileError } from '../../../../shared/ui/media-picker/file-rules';

/** The 176px cover of the store with the "تغيير صورة الغلاف" button on its bottom-left corner. */
@Component({
  selector: 'app-store-cover-picker',
  imports: [AppIcon],
  templateUrl: './store-cover-picker.html',
  host: { class: 'relative block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoreCoverPicker {
  readonly imageUrl = input.required<string | null>();
  readonly picked = output<File>();

  protected readonly accept = PICTURE_RULES.accepted.join(',');
  protected readonly error = signal<string | null>(null);
  /** A new saved cover replaces the local preview. */
  protected readonly previewUrl = linkedSignal<string | null, string | null>({
    source: this.imageUrl,
    computation: () => null,
  });

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly createdUrls = new Set<string>();

  constructor() {
    // The object URLs are ours to create, so they are ours to release.
    inject(DestroyRef).onDestroy(() => this.createdUrls.forEach((url) => URL.revokeObjectURL(url)));
  }

  protected openPicker(): void {
    this.fileInput().nativeElement.click();
  }

  protected pickFromInput(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    const [file] = Array.from(fileInput.files ?? []);
    fileInput.value = '';
    if (!file) {
      return;
    }
    const error = findFileError(file, PICTURE_RULES);
    this.error.set(error);
    if (error) {
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    this.createdUrls.add(previewUrl);
    this.previewUrl.set(previewUrl);
    this.picked.emit(file);
  }
}
