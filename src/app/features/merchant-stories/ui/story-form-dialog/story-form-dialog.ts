import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  linkedSignal,
  output,
  signal,
} from '@angular/core';
import { formatCharacterCount } from '../../../../shared/formatting/character-count';
import { formatLatinFileSize } from '../../../../shared/formatting/file-size';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FieldLabel } from '../../../../shared/ui/field-label/field-label';
import { FileDropzone } from '../../../../shared/ui/file-dropzone/file-dropzone';
import { FormDialogFrame } from '../../../../shared/ui/form-dialog-frame/form-dialog-frame';
import { StoryDraft } from '../../models/story-draft';
import { StoryFormOptions } from '../../models/story-form-options';
import {
  STORY_ACCEPTED_TYPES,
  findStoryFileError,
  storyKindOf,
} from '../../state/story-upload-rules';

const CAPTION_MAX_LENGTH = 120;
const CAPTION_FIELD_ID = 'story-caption';

interface DialogCopy {
  readonly heading: string;
  readonly submitLabel: string;
}

const ADD_COPY: DialogCopy = { heading: 'إضافة قصة جديدة', submitLabel: 'نشر القصة' };
const EDIT_COPY: DialogCopy = { heading: 'تعديل القصة', submitLabel: 'حفظ التعديلات' };

/** The file the form will send, or the saved one it keeps: one grey row either way. */
interface FileRow {
  readonly role: 'picked-file' | 'saved-file';
  readonly name: string;
  /** "2.4 MB" for a picked file; a saved one has no size to show. */
  readonly sizeText: string | null;
  /** null draws the video tile. */
  readonly pictureUrl: string | null;
  readonly actionLabel: string;
  /** Red for removing a picked file, blue for swapping the saved one. */
  readonly actionColor: string;
  readonly actionTestId: string;
}

/** The "إضافة قصة جديدة" dialog, also opened on a story to edit it. */
@Component({
  selector: 'app-story-form-dialog',
  imports: [AppIcon, FieldLabel, FileDropzone, FormDialogFrame],
  templateUrl: './story-form-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StoryFormDialog {
  readonly dialog = input.required<StoryFormOptions>();
  readonly isBusy = input<boolean>(false);
  readonly submitted = output<StoryDraft>();
  readonly cancelled = output<void>();

  protected readonly accept = STORY_ACCEPTED_TYPES;
  protected readonly captionMaxLength = CAPTION_MAX_LENGTH;
  protected readonly captionFieldId = CAPTION_FIELD_ID;

  protected readonly pickedFile = signal<File | null>(null);
  protected readonly fileError = signal<string | null>(null);
  protected readonly keepsSavedFile = linkedSignal(() => this.dialog().story !== null);
  protected readonly caption = linkedSignal(() => this.dialog().story?.caption ?? '');

  protected readonly copy = computed(() => (this.dialog().story ? EDIT_COPY : ADD_COPY));
  protected readonly counter = computed(
    () => `${formatCharacterCount(this.caption(), CAPTION_MAX_LENGTH)} حرف`,
  );
  protected readonly canSubmit = computed(
    () => (this.pickedFile() !== null || this.keepsSavedFile()) && !this.isBusy(),
  );
  protected readonly fileRow = computed<FileRow | null>(() => {
    const picked = this.pickedFile();
    if (picked) {
      return {
        role: 'picked-file',
        name: picked.name,
        sizeText: formatLatinFileSize(picked.size),
        pictureUrl: storyKindOf(picked) === 'image' ? URL.createObjectURL(picked) : null,
        actionLabel: 'حذف',
        actionColor: 'text-error',
        actionTestId: 'remove-picked-story',
      };
    }
    const saved = this.dialog().story;
    if (!saved || !this.keepsSavedFile()) {
      return null;
    }
    const isImage = saved.kind === 'image';
    return {
      role: 'saved-file',
      name: isImage ? 'الصورة الحالية' : 'الفيديو الحالي',
      sizeText: null,
      pictureUrl: isImage ? saved.url : saved.posterUrl,
      actionLabel: 'استبدال',
      actionColor: 'text-primary',
      actionTestId: 'replace-saved-story',
    };
  });

  protected onFilesPicked(files: readonly File[]): void {
    const [file] = files;
    if (!file) {
      return;
    }
    const error = findStoryFileError(file);
    this.fileError.set(error);
    if (!error) {
      this.pickedFile.set(file);
    }
  }

  protected clearFile(): void {
    this.pickedFile.set(null);
    this.keepsSavedFile.set(false);
    this.fileError.set(null);
  }

  protected onCaptionInput(event: Event): void {
    this.caption.set((event.target as HTMLTextAreaElement).value);
  }

  protected submit(): void {
    if (!this.canSubmit()) {
      return;
    }
    this.submitted.emit({ file: this.pickedFile(), caption: this.caption().trim() || null });
  }
}
