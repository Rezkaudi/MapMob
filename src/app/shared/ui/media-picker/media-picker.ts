import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { AppIcon } from '../app-icon/app-icon';
import { FileDropzone } from '../file-dropzone/file-dropzone';
import { FileRules, findFileError } from './file-rules';
import { MediaFile } from './media-file';

export type MediaKind = 'image' | 'video';

const BYTES_PER_KILOBYTE = 1024;
const BYTES_PER_MEGABYTE = 1024 * 1024;

@Component({
  selector: 'app-media-picker',
  imports: [AppIcon, FileDropzone],
  templateUrl: './media-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaPicker {
  readonly prompt = input.required<string>();
  readonly hint = input<string>('');
  readonly accept = input<string>('');
  readonly rules = input.required<FileRules>();
  readonly kind = input<MediaKind>('image');
  readonly files = input.required<readonly MediaFile[]>();
  readonly filesChange = output<readonly MediaFile[]>();

  protected readonly errors = signal<readonly string[]>([]);

  private nextId = 0;

  constructor() {
    // The object URLs are ours to create, so they are ours to release.
    inject(DestroyRef).onDestroy(() => {
      for (const item of this.files()) {
        URL.revokeObjectURL(item.previewUrl);
      }
    });
  }

  protected add(picked: readonly File[]): void {
    const errors: string[] = [];
    const accepted: MediaFile[] = [];

    for (const file of picked) {
      const error = findFileError(file, this.rules());
      if (error) {
        errors.push(error);
        continue;
      }
      accepted.push(this.toMediaFile(file));
    }

    // Identical messages would collide as @for track keys, so keep one of each.
    this.errors.set([...new Set(errors)]);
    if (accepted.length > 0) {
      this.filesChange.emit([...this.files(), ...accepted]);
    }
  }

  protected remove(target: MediaFile): void {
    URL.revokeObjectURL(target.previewUrl);
    this.filesChange.emit(this.files().filter((item) => item.id !== target.id));
  }

  /** The first file is the main one, so promoting means moving it to the front. */
  protected makeMain(target: MediaFile): void {
    this.filesChange.emit([target, ...this.files().filter((item) => item.id !== target.id)]);
  }

  protected sizeLabel(sizeInBytes: number): string {
    if (sizeInBytes < BYTES_PER_MEGABYTE) {
      return `${(sizeInBytes / BYTES_PER_KILOBYTE).toFixed(1)} ك.ب`;
    }
    return `${(sizeInBytes / BYTES_PER_MEGABYTE).toFixed(1)} م.ب`;
  }

  private toMediaFile(file: File): MediaFile {
    this.nextId += 1;
    return {
      id: `media-${this.nextId}-${file.name}`,
      name: file.name,
      sizeInBytes: file.size,
      file,
      previewUrl: URL.createObjectURL(file),
    };
  }
}
