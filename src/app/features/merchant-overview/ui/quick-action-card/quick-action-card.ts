import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { QuickAction } from '../../models/quick-action';

const HIGHLIGHTED_CARD =
  'bg-[linear-gradient(180deg,#0583ec_0%,#0030a8_50%,#001e8f_100%)] text-white';
const PLAIN_CARD = 'bg-surface text-text-secondary';

@Component({
  selector: 'app-quick-action-card',
  imports: [AppIcon, RouterLink],
  templateUrl: './quick-action-card.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuickActionCard {
  readonly action = input.required<QuickAction>();

  protected readonly cardClass = computed(() =>
    this.action().isHighlighted ? HIGHLIGHTED_CARD : PLAIN_CARD,
  );
  protected readonly titleClass = computed(() =>
    this.action().isHighlighted ? 'text-white' : 'text-text-primary',
  );
  protected readonly descriptionClass = computed(() =>
    this.action().isHighlighted
      ? 'text-[13px]/[18px] text-white opacity-90'
      : 'text-[12px]/[18px] text-text-secondary',
  );
  protected readonly arrowClass = computed(() =>
    this.action().isHighlighted ? 'text-white' : 'text-text-primary',
  );
}
