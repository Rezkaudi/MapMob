import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  input,
  output,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FaqDialog } from '../../models/faq-dialog';
import { FaqQuestionDraft } from '../../models/faq-question-draft';
import {
  FAQ_ANSWER_MAX_LENGTH,
  createFaqQuestionFormGroup,
  toFaqQuestionDraft,
} from '../../state/faq-question-form-group';
import { touchedError } from '../../state/touched-error';
import { FAQ_QUESTION_DIALOG_COPY } from './faq-question-dialog-copy';

const MESSAGES = {
  question: 'اكتب نص السؤال',
  answer: 'اكتب نص الإجابة',
};

/** The 580px card that adds a question or edits one. */
@Component({
  selector: 'app-faq-question-dialog',
  imports: [AppIcon, ReactiveFormsModule],
  templateUrl: './faq-question-dialog.html',
  changeDetection: ChangeDetectionStrategy.Default,
})
export class FaqQuestionDialog implements OnInit {
  readonly dialog = input.required<FaqDialog>();
  readonly isBusy = input<boolean>(false);
  readonly saveError = input<string | null>(null);
  readonly saved = output<FaqQuestionDraft>();
  readonly closed = output<void>();

  protected readonly form = createFaqQuestionFormGroup();
  protected readonly answerMaxLength = FAQ_ANSWER_MAX_LENGTH;
  protected readonly copy = computed(() => FAQ_QUESTION_DIALOG_COPY[this.dialog().mode]);
  protected readonly editedNumber = computed(() => {
    const dialog = this.dialog();
    return dialog.mode === 'edit' ? dialog.number : null;
  });
  private readonly answer = toSignal(this.form.controls.answer.valueChanges, { initialValue: '' });
  protected readonly answerLength = computed(() => this.answer().length);

  ngOnInit(): void {
    const dialog = this.dialog();
    if (dialog.mode === 'edit') {
      this.form.setValue({ question: dialog.question.question, answer: dialog.question.answer });
    }
  }

  protected get questionError(): string | null {
    return touchedError(this.form.controls.question, MESSAGES.question);
  }

  protected get answerError(): string | null {
    return touchedError(this.form.controls.answer, MESSAGES.answer);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.form.invalid) {
      return;
    }
    this.saved.emit(toFaqQuestionDraft(this.form.getRawValue()));
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }
}
