import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { FaqQuestion } from '../../models/faq-question';

const NUMBER_CLASSES = {
  expanded: 'border-[#bae0fd] bg-[#f0f7ff] text-primary',
  collapsed: 'border-border bg-[#f1f5f9] text-text-secondary',
};

/** One question row: its number, the question that opens the answer, then edit and delete. */
@Component({
  selector: 'app-faq-question-item',
  imports: [AppIcon],
  templateUrl: './faq-question-item.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FaqQuestionItem {
  readonly question = input.required<FaqQuestion>();
  readonly number = input.required<number>();
  readonly isExpanded = input<boolean>(false);
  readonly toggle = output<void>();
  readonly edit = output<FaqQuestion>();
  readonly remove = output<FaqQuestion>();

  protected readonly numberClasses = computed(
    () => NUMBER_CLASSES[this.isExpanded() ? 'expanded' : 'collapsed'],
  );
  protected readonly answerId = computed(() => `faq-answer-${this.question().id}`);
}
