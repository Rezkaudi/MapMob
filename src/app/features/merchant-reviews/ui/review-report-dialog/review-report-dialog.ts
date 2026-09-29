import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { formatCharacterCount } from '../../../../shared/formatting/character-count';
import { ArabicDatePipe } from '../../../../shared/pipes/arabic-date.pipe';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FormDialogFrame } from '../../../../shared/ui/form-dialog-frame/form-dialog-frame';
import { RadioDot } from '../../../../shared/ui/radio-dot/radio-dot';
import { StarRating } from '../../../../shared/ui/star-rating/star-rating';
import { OwnerReview } from '../../models/owner-review';
import { ReviewReport } from '../../models/review-report';
import { REVIEW_REPORT_REASON_LABEL, ReviewReportReason } from '../../models/review-report-reason';

const NOTES_MAX_LENGTH = 500;
const SUBHEADING =
  'إذا كنت تعتقد أن هذه المراجعة مسيئة أو غير صحيحة ، يمكنك إرسال بلاغ رسمي إلى فريق رقابة MapMob للتحقق منها واتخاذ الإجراء المناسب.';
const REASON_CHOICES = (Object.keys(REVIEW_REPORT_REASON_LABEL) as ReviewReportReason[]).map(
  (reason) => ({ reason, label: REVIEW_REPORT_REASON_LABEL[reason] }),
);

/** "الإبلاغ عن مراجعة": a reason, optional details, then the report goes to the admins. */
@Component({
  selector: 'app-review-report-dialog',
  imports: [AppIcon, ArabicDatePipe, FormDialogFrame, RadioDot, StarRating],
  templateUrl: './review-report-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewReportDialog {
  readonly review = input.required<OwnerReview>();
  readonly isBusy = input<boolean>(false);
  readonly closed = output<void>();
  readonly submitted = output<ReviewReport>();

  protected readonly subheading = SUBHEADING;
  protected readonly reasonChoices = REASON_CHOICES;
  protected readonly notesMaxLength = NOTES_MAX_LENGTH;
  protected readonly pickedReason = signal<ReviewReportReason | null>(null);
  protected readonly notes = signal('');
  protected readonly notesCountText = computed(
    () =>
      `الحد الأقصى ${NOTES_MAX_LENGTH} حرف • (${formatCharacterCount(this.notes(), NOTES_MAX_LENGTH)})`,
  );
  protected readonly canSend = computed(() => this.pickedReason() !== null && !this.isBusy());

  protected changeNotes(event: Event): void {
    this.notes.set((event.target as HTMLTextAreaElement).value);
  }

  protected send(): void {
    const reason = this.pickedReason();
    if (!reason || this.isBusy()) {
      return;
    }
    this.submitted.emit({ reason, notes: this.notes().trim() || null });
  }
}
