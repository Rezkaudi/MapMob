import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { RichTextEditor } from '../../../../shared/ui/rich-text-editor/rich-text-editor';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { LegalPageKind } from '../../models/content-page-kind';
import { ContentPageStatus } from '../../models/content-page-status';
import {
  CONTENT_EDITOR_DESCRIPTION,
  CONTENT_EDIT_STEP_LABEL,
  CONTENT_PAGE_NAMES,
  CONTENT_SECTION_LABEL,
} from '../../state/content-page-names';
import { CONTENT_URL } from '../../state/content-page-route';
import { LegalPageEditorStore } from '../../state/legal-page-editor.store';
import { createLegalPageFormGroup, toLegalPageDraft } from '../../state/legal-page-form-group';
import { touchedError } from '../../../../shared/forms/touched-error';
import { ContentFieldLabel } from '../../ui/content-field-label/content-field-label';
import { ContentFormCard } from '../../ui/content-form-card/content-form-card';
import { ContentSaveToasts } from '../../ui/content-save-toasts/content-save-toasts';
import { PageTitleField } from '../../ui/page-title-field/page-title-field';

const MISSING_BODY_MESSAGE = 'اكتب محتوى الصفحة';

/** The terms and privacy editors: a title and one long rich text. */
@Component({
  selector: 'app-legal-page-editor',
  imports: [
    ContentFieldLabel,
    ContentFormCard,
    ContentSaveToasts,
    ErrorState,
    FormActionBar,
    FormPageHeading,
    PageTitleField,
    ReactiveFormsModule,
    RichTextEditor,
    Skeleton,
  ],
  templateUrl: './legal-page-editor.html',
  providers: [LegalPageEditorStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LegalPageEditor {
  /** Bound from the route's `data`. */
  readonly kind = input.required<LegalPageKind>();

  protected readonly store = inject(LegalPageEditorStore);
  protected readonly form = createLegalPageFormGroup();
  protected readonly pageName = computed(() => CONTENT_PAGE_NAMES[this.kind()]);
  protected readonly contentUrl = CONTENT_URL;
  protected readonly sectionLabel = CONTENT_SECTION_LABEL;
  protected readonly stepLabel = CONTENT_EDIT_STEP_LABEL;
  protected readonly description = CONTENT_EDITOR_DESCRIPTION;

  constructor() {
    effect(() => {
      const kind = this.kind();
      untracked(() => this.store.load(kind));
    });
    effect(() => {
      const page = this.store.page();
      if (page) {
        untracked(() => this.form.reset(page));
      }
    });
  }

  protected get bodyError(): string | null {
    return touchedError(this.form.controls.body, MISSING_BODY_MESSAGE);
  }

  protected publish(): void {
    this.save('published');
  }

  protected saveDraft(): void {
    this.save('draft');
  }

  private save(status: ContentPageStatus): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.store.save(toLegalPageDraft(this.form.getRawValue(), status));
  }
}
