import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { AddButton } from '../../../../shared/ui/add-button/add-button';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { FormPageHeading } from '../../../../shared/ui/form-page-heading/form-page-heading';
import { Skeleton } from '../../../../shared/ui/skeleton/skeleton';
import { Toast } from '../../../../shared/ui/toast/toast';
import {
  CONTENT_EDITOR_DESCRIPTION,
  CONTENT_EDIT_STEP_LABEL,
  CONTENT_PAGE_NAMES,
  CONTENT_SECTION_LABEL,
} from '../../state/content-page-names';
import { CONTENT_URL } from '../../state/content-page-route';
import { FaqStore } from '../../state/faq.store';
import { FAQ_DELETE_COPY } from '../../ui/faq-delete-copy';
import { FaqListHeader } from '../../ui/faq-list-header/faq-list-header';
import { FaqQuestionDialog } from '../../ui/faq-question-dialog/faq-question-dialog';
import { FaqQuestionItem } from '../../ui/faq-question-item/faq-question-item';

const QUESTION_PLACEHOLDER_COUNT = 4;

@Component({
  selector: 'app-faq-page',
  imports: [
    AddButton,
    ConfirmActionDialog,
    ErrorState,
    FaqListHeader,
    FaqQuestionDialog,
    FaqQuestionItem,
    FormPageHeading,
    Skeleton,
    Toast,
  ],
  templateUrl: './faq-page.html',
  providers: [FaqStore],
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqPage {
  protected readonly store = inject(FaqStore);
  protected readonly deleteCopy = FAQ_DELETE_COPY;
  protected readonly pageName = CONTENT_PAGE_NAMES.faq;
  protected readonly contentUrl = CONTENT_URL;
  protected readonly sectionLabel = CONTENT_SECTION_LABEL;
  protected readonly stepLabel = CONTENT_EDIT_STEP_LABEL;
  protected readonly description = CONTENT_EDITOR_DESCRIPTION;
  protected readonly placeholderRows = Array.from({ length: QUESTION_PLACEHOLDER_COUNT });

  constructor() {
    this.store.loadQuestions();
  }
}
