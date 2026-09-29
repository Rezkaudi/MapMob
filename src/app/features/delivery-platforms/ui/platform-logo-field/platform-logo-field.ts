import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  computed,
  inject,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { PICTURE_RULES } from '../../../../shared/files/picture-rules';
import { FileDropzone } from '../../../../shared/ui/file-dropzone/file-dropzone';
import { findFileError } from '../../../../shared/ui/media-picker/file-rules';

/** Stands in for a file name when the logo came back from the server. */
const SAVED_LOGO_LABEL = 'الشعار الحالي';

/** The dashed "logo" drop zone of the add dialog, or the picked logo with a remove button. */
@Component({
  selector: 'app-platform-logo-field',
  imports: [FileDropzone],
  templateUrl: './platform-logo-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlatformLogoField {
  readonly savedUrl = input<string | null>(null);
  readonly picked = output<File>();
  readonly removed = output<void>();

  protected readonly accept = PICTURE_RULES.accepted.join(',');
  protected readonly previewUrl = linkedSignal(() => this.savedUrl());
  protected readonly pickedName = signal('');
  protected readonly previewName = computed(() => this.pickedName() || SAVED_LOGO_LABEL);
  protected readonly error = signal<string | null>(null);
  private readonly createdUrls = new Set<string>();

  constructor() {
    // The object URLs are ours to create, so they are ours to release.
    inject(DestroyRef).onDestroy(() => this.createdUrls.forEach((url) => URL.revokeObjectURL(url)));
  }

  protected pick(files: readonly File[]): void {
    const [file] = files;
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
    this.pickedName.set(file.name);
    this.picked.emit(file);
  }

  protected remove(): void {
    this.previewUrl.set(null);
    this.pickedName.set('');
    this.removed.emit();
  }
}
