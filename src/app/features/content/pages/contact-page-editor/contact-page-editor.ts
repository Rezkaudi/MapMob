import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { ContentPageStatus } from '../../models/content-page-status';
import { ContactPageEditorStore } from '../../state/contact-page-editor.store';
import {
  createContactPageFormGroup,
  toContactPageDraft,
} from '../../state/contact-page-form-group';
import {
  CONTENT_EDITOR_DESCRIPTION,
  CONTENT_EDIT_STEP_LABEL,
  CONTENT_PAGE_NAMES,
  CONTENT_SECTION_LABEL,
} from '../../state/content-page-names';
import { CONTENT_URL } from '../../state/content-page-route';
import { touchedError } from '../../state/touched-error';
import { ContactChannelField } from '../../ui/contact-channel-field/contact-channel-field';
import { ContentFieldLabel } from '../../ui/content-field-label/content-field-label';
import { ContentFormCard } from '../../ui/content-form-card/content-form-card';
import { ContentSaveToasts } from '../../ui/content-save-toasts/content-save-toasts';
import { PageTitleField } from '../../ui/page-title-field/page-title-field';
import { CONTACT_SOCIAL_CHANNELS } from './contact-social-channels';

const MESSAGES = {
  introduction: 'اكتب النص التعريفي',
  phone: 'اكتب رقم هاتف صحيح',
  email: 'اكتب بريداً إلكترونياً صحيحاً',
  link: 'اكتب رابطاً يبدأ بـ https://',
};

@Component({
  selector: 'app-contact-page-editor',
  imports: [
    ContactChannelField,
    ContentFieldLabel,
    ContentFormCard,
    ContentSaveToasts,
    ErrorState,
    FormActionBar,
    FormPageHeading,
    PageTitleField,
    ReactiveFormsModule,
    Skeleton,
  ],
  templateUrl: './contact-page-editor.html',
  providers: [ContactPageEditorStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactPageEditor {
  protected readonly store = inject(ContactPageEditorStore);
  protected readonly form = createContactPageFormGroup();
  protected readonly messages = MESSAGES;
  protected readonly socialChannels = CONTACT_SOCIAL_CHANNELS;
  protected readonly pageName = CONTENT_PAGE_NAMES.contact;
  protected readonly contentUrl = CONTENT_URL;
  protected readonly sectionLabel = CONTENT_SECTION_LABEL;
  protected readonly stepLabel = CONTENT_EDIT_STEP_LABEL;
  protected readonly description = CONTENT_EDITOR_DESCRIPTION;

  constructor() {
    this.store.load();
    effect(() => {
      const page = this.store.page();
      if (page) {
        untracked(() => this.form.reset(page));
      }
    });
  }

  protected get introductionError(): string | null {
    return touchedError(this.form.controls.introduction, MESSAGES.introduction);
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
    this.store.save(toContactPageDraft(this.form.getRawValue(), status));
  }
}
