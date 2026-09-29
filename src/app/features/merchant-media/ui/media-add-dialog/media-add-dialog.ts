import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { formatLatinFileSize } from '../../../../shared/formatting/file-size';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../shared/ui/field-label/field-label';
import { FileDropzone } from '../../../../shared/ui/file-dropzone/file-dropzone';
import { FormDialogFrame } from '../../../../shared/ui/form-dialog-frame/form-dialog-frame';
import { findFileError } from '../../../../shared/ui/media-picker/file-rules';
import { MediaAddOptions } from '../../models/media-add-options';
import { MediaKind } from '../../models/media-kind';
import { MEDIA_UPLOAD_COPY } from '../../state/media-upload-copy';
import { MEDIA_UPLOAD_RULES, acceptedTypesOf } from '../../state/media-upload-rules';
import { MediaKindChoice } from '../media-kind-choice/media-kind-choice';
import { MediaDraft } from '../../models/media-draft';

interface PickedMedia {
  readonly file: File;
  readonly previewUrl: string;
  readonly sizeText: string;
}

/** The "إضافة وسائط" dialog: pick a kind, drop one file, and maybe make it the main picture. */
@Component({
  selector: 'app-media-add-dialog',
  imports: [AppIcon, FieldLabel, FileDropzone, FormDialogFrame, MediaKindChoice],
  templateUrl: './media-add-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaAddDialog {
  readonly dialog = input.required<MediaAddOptions>();
  readonly isBusy = input<boolean>(false);
  readonly submitted = output<MediaDraft>();
  readonly cancelled = output<void>();

  protected readonly kind = linkedSignal(() => this.dialog().startKind);
  protected readonly picked = signal<PickedMedia | null>(null);
  protected readonly fileError = signal<string | null>(null);
  protected readonly isMain = signal(false);

  protected readonly isImage = computed(() => this.kind() === 'image');
  protected readonly uploadCopy = computed(() => MEDIA_UPLOAD_COPY[this.kind()]);
  protected readonly accept = computed(() => acceptedTypesOf(this.kind()));
  protected readonly canSubmit = computed(() => this.picked() !== null && !this.isBusy());

  protected selectKind(kind: MediaKind): void {
    if (kind === this.kind()) {
      return;
    }
    this.kind.set(kind);
    this.clearFile();
    this.isMain.set(false);
  }

  protected onFilesPicked(files: readonly File[]): void {
    const [file] = files;
    if (!file) {
      return;
    }
    const error = findFileError(file, MEDIA_UPLOAD_RULES[this.kind()]);
    this.fileError.set(error);
    if (error) {
      return;
    }
    this.picked.set({
      file,
      previewUrl: URL.createObjectURL(file),
      sizeText: formatLatinFileSize(file.size),
    });
  }

  protected clearFile(): void {
    this.picked.set(null);
    this.fileError.set(null);
  }

  protected toggleMain(event: Event): void {
    this.isMain.set((event.target as HTMLInputElement).checked);
  }

  protected submit(): void {
    const picked = this.picked();
    if (!picked || this.isBusy()) {
      return;
    }
    this.submitted.emit({
      kind: this.kind(),
      file: picked.file,
      isMain: this.isImage() && this.isMain(),
    });
  }
}
