import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { ReviewStatus } from '../../models/review-status';

interface StatusChoice {
  readonly value: ReviewStatus | null;
  readonly label: string;
  readonly pickedClasses: string;
}

/** The filter design writes "مُبلّغ عنه" with its marks, unlike the table pill. */
const STATUS_CHOICES: readonly StatusChoice[] = [
  { value: null, label: 'الكل', pickedClasses: 'border-primary bg-primary' },
  { value: 'published', label: 'منشور', pickedClasses: 'border-status-success bg-status-success' },
  { value: 'reported', label: 'مُبلّغ عنه', pickedClasses: 'border-[#f43f5e] bg-status-error' },
  { value: 'hidden', label: 'مخفي', pickedClasses: 'border-text-secondary bg-text-secondary' },
];
const PICKED_TEXT = 'font-medium text-white';
const IDLE_CHOICE = 'border-border text-text-secondary hover:text-text-primary';

@Component({
  selector: 'app-review-status-picker',
  templateUrl: './review-status-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ReviewStatusPicker {
  readonly selected = input<ReviewStatus | null>(null);
  readonly selectedChange = output<ReviewStatus | null>();

  protected readonly choices = computed(() =>
    STATUS_CHOICES.map((choice) => {
      const isPicked = choice.value === this.selected();
      return {
        ...choice,
        isPicked,
        classes: isPicked ? `${choice.pickedClasses} ${PICKED_TEXT}` : IDLE_CHOICE,
      };
    }),
  );
}
