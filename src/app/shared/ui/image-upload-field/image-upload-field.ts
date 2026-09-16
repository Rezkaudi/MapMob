import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  computed,
  inject,
  input,
  output,
  signal,
  viewChild,
} from '@angular/core';
import { readImageSize } from '../../files/read-image-size';
import { describeUploadedImage } from '../../formatting/uploaded-image-summary';
import { AppIcon } from '../app-icon/app-icon';
import { FileDropzone } from '../file-dropzone/file-dropzone';
import { FileRules, findFileError } from '../media-picker/file-rules';
import { UploadedImage } from './uploaded-image';

export type UploadKind = 'image' | 'video';

interface UploadCopy {
  readonly prompt: string;
  readonly hint: string;
  readonly replaceLabel: string;
}

const UPLOAD_COPY: Record<UploadKind, UploadCopy> = {
  image: {
    prompt: 'اسحب وأفلت الصور هنا',
    hint: 'الحد الأقصى لحجم الصورة 5 ميجابايت (JPG, PNG)',
    replaceLabel: 'تغيير الصورة',
  },
  video: {
    prompt: 'اسحب وأفلت الفيديو هنا',
    hint: 'الحد الأقصى لحجم الفيديو 50 ميجابايت',
    replaceLabel: 'تغيير الفيديو',
  },
};

/** One picture or video for a form: the dashed drop zone, and the card describing the picked file. */
@Component({
  selector: 'app-image-upload-field',
  imports: [AppIcon, FileDropzone],
  templateUrl: './image-upload-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ImageUploadField {
  readonly rules = input.required<FileRules>();
  readonly image = input<UploadedImage | null>(null);
  readonly kind = input<UploadKind>('image');
  readonly imageChange = output<UploadedImage | null>();

  protected readonly copy = computed(() => UPLOAD_COPY[this.kind()]);
  protected readonly error = signal<string | null>(null);
  protected readonly accept = computed(() => this.rules().accepted.join(','));
  protected readonly summary = computed(() => {
    const image = this.image();
    return image ? describeUploadedImage(image) : '';
  });

  private readonly replaceInput = viewChild<ElementRef<HTMLInputElement>>('replaceInput');
  private readonly createdUrls = new Set<string>();

  constructor() {
    // The object URLs are ours to create, so they are ours to release.
    inject(DestroyRef).onDestroy(() => this.createdUrls.forEach((url) => URL.revokeObjectURL(url)));
  }

  protected async pick(files: readonly File[]): Promise<void> {
    const [file] = files;
    if (!file) {
      return;
    }
    const error = findFileError(file, this.rules());
    this.error.set(error);
    if (error) {
      return;
    }
    const previewUrl = URL.createObjectURL(file);
    this.createdUrls.add(previewUrl);
    const size = this.kind() === 'image' ? await readImageSize(previewUrl) : null;
    this.imageChange.emit({
      file,
      name: file.name,
      previewUrl,
      sizeInBytes: file.size,
      width: size?.width ?? null,
      height: size?.height ?? null,
    });
  }

  protected pickFromInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.pick(Array.from(input.files ?? []));
    input.value = '';
  }

  protected openReplacePicker(): void {
    this.replaceInput()?.nativeElement.click();
  }

  protected remove(): void {
    this.error.set(null);
    this.imageChange.emit(null);
  }
}
