import { ChangeDetectionStrategy, Component, effect, inject, untracked } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormActionBar } from '../../../../shared/ui/form-action-bar/form-action-bar';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import {
  CONTENT_EDITOR_DESCRIPTION,
  CONTENT_EDIT_STEP_LABEL,
  CONTENT_PAGE_NAMES,
  CONTENT_SECTION_LABEL,
} from '../../state/content-page-names';
import { CONTENT_URL } from '../../state/content-page-route';
import { ProviderJoinPageEditorStore } from '../../state/provider-join-page-editor.store';
import {
  createProviderJoinPageFormGroup,
  toProviderJoinPageDraft,
} from '../../state/provider-join-page-form-group';
import { ContentFormCard } from '../../ui/content-form-card/content-form-card';
import { ContentSaveToasts } from '../../ui/content-save-toasts/content-save-toasts';
import { PageTitleField } from '../../ui/page-title-field/page-title-field';
import { RegistrationFormUrlField } from '../../ui/registration-form-url-field/registration-form-url-field';

/** "انضم إلينا كمقدم خدمة": a title and the link to the outside sign-up form. */
@Component({
  selector: 'app-provider-join-page-editor',
  imports: [
    ContentFormCard,
    ContentSaveToasts,
    ErrorState,
    FormActionBar,
    FormPageHeading,
    PageTitleField,
    ReactiveFormsModule,
    RegistrationFormUrlField,
    Skeleton,
  ],
  templateUrl: './provider-join-page-editor.html',
  providers: [ProviderJoinPageEditorStore],
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProviderJoinPageEditor {
  protected readonly store = inject(ProviderJoinPageEditorStore);
  protected readonly form = createProviderJoinPageFormGroup();
  protected readonly pageName = CONTENT_PAGE_NAMES['provider-join'];
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

  protected publish(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.store.save(toProviderJoinPageDraft(this.form.getRawValue()));
  }
}
