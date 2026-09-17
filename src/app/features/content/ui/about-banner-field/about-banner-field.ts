import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { PICTURE_RULES } from '../../../../shared/files/picture-rules';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { findFileError } from '../../../../shared/ui/media-picker/file-rules';
import { ContentFieldLabel } from '../content-field-label/content-field-label';

/** "صورة عن التطبيق": the banner preview in its dashed frame, with replace and delete. */
@Component({
  selector: 'app-about-banner-field',
  imports: [AppIcon, ContentFieldLabel],
  templateUrl: './about-banner-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutBannerField {
  readonly banner = input<UploadedImage | null>(null);
  readonly bannerChange = output<UploadedImage | null>();

  protected readonly accept = PICTURE_RULES.accepted.join(',');
  protected readonly error = signal<string | null>(null);

  private readonly fileInput = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');
  private readonly createdUrls = new Set<string>();

  constructor() {
    inject(DestroyRef).onDestroy(() => this.createdUrls.forEach((url) => URL.revokeObjectURL(url)));
  }

  protected openPicker(): void {
    this.fileInput().nativeElement.click();
  }

  protected pickFromInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const [file] = Array.from(input.files ?? []);
    input.value = '';
    if (file) {
      this.pick(file);
    }
  }

  protected remove(): void {
    this.error.set(null);
    this.bannerChange.emit(null);
  }

  private pick(file: File): void {
    const error = findFileError(file, PICTURE_RULES);
    this.error.set(error);
    if (error) {
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    this.createdUrls.add(previewUrl);
    this.bannerChange.emit({
      file,
      name: file.name,
      previewUrl,
      sizeInBytes: file.size,
      width: null,
      height: null,
    });
  }
}
