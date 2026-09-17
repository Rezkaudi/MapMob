import {
  ChangeDetectionStrategy,
  Component,
  effect,
  inject,
  signal,
  untracked,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { UploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image';
import { toUploadedImage } from '../../../../shared/ui/image-upload-field/uploaded-image-from-url';
import { RichTextEditor } from '../../../../shared/ui/rich-text-editor/rich-text-editor';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { ContentPageStatus } from '../../models/content-page-status';
import { AboutPageEditorStore } from '../../state/about-page-editor.store';
import {
  createAboutPageFormGroup,
  toAboutPageDraft,
  toAboutPageFormValue,
} from '../../state/about-page-form-group';
import {
  CONTENT_EDITOR_DESCRIPTION,
  CONTENT_EDIT_STEP_LABEL,
  CONTENT_PAGE_NAMES,
  CONTENT_SECTION_LABEL,
} from '../../state/content-page-names';
import { CONTENT_URL } from '../../state/content-page-route';
import { touchedError } from '../../state/touched-error';
import { AboutBannerField } from '../../ui/about-banner-field/about-banner-field';
import { ContactChannelField } from '../../ui/contact-channel-field/contact-channel-field';
import { ContentFieldLabel } from '../../ui/content-field-label/content-field-label';
import { ContentFormCard } from '../../ui/content-form-card/content-form-card';
import { ContentSaveToasts } from '../../ui/content-save-toasts/content-save-toasts';
import { PageTitleField } from '../../ui/page-title-field/page-title-field';

const MESSAGES = {
  summary: 'اكتب نبذة عن التطبيق',
  phone: 'اكتب رقم هاتف صحيح',
  email: 'اكتب بريداً إلكترونياً صحيحاً',
  address: 'اكتب الموقع الجغرافي',
};

@Component({
  selector: 'app-about-page-editor',
  imports: [
    AboutBannerField,
    ContactChannelField,
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
  templateUrl: './about-page-editor.html',
  providers: [AboutPageEditorStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AboutPageEditor {
  protected readonly store = inject(AboutPageEditorStore);
  protected readonly form = createAboutPageFormGroup();
  protected readonly messages = MESSAGES;
  protected readonly pageName = CONTENT_PAGE_NAMES.about;
  protected readonly contentUrl = CONTENT_URL;
  protected readonly sectionLabel = CONTENT_SECTION_LABEL;
  protected readonly stepLabel = CONTENT_EDIT_STEP_LABEL;
  protected readonly description = CONTENT_EDITOR_DESCRIPTION;
  /** View state only: the banner picked or kept in the form. */
  protected readonly banner = signal<UploadedImage | null>(null);

  constructor() {
    this.store.load();
    effect(() => {
      const page = this.store.page();
      if (page) {
        untracked(() => {
          this.form.reset(toAboutPageFormValue(page));
          this.banner.set(toUploadedImage(page.bannerUrl));
        });
      }
    });
  }

  protected get summaryError(): string | null {
    return touchedError(this.form.controls.summary, MESSAGES.summary);
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
    const draft = toAboutPageDraft(this.form.getRawValue(), {
      banner: this.banner(),
      hadSavedBanner: Boolean(this.store.page()?.bannerUrl),
      status,
    });
    this.store.save(draft);
  }
}
