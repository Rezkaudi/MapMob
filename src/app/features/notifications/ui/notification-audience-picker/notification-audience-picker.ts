import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { OptionCard } from '../../../../shared/ui/option-card/option-card';
import {
  NOTIFICATION_AUDIENCE_LABELS,
  NotificationAudience,
} from '../../models/notification-audience';
import { RECIPIENT_MODE_LABELS, RecipientMode } from '../../models/recipient-mode';

interface AudienceChoice {
  readonly audience: NotificationAudience;
  readonly title: string;
  readonly description: string;
}

/** RTL puts the first card on the right, as the design leads with the users. */
const AUDIENCE_CHOICES: readonly AudienceChoice[] = [
  {
    audience: 'users',
    title: NOTIFICATION_AUDIENCE_LABELS.users,
    description: 'إرسال الإشعار إلى مستخدمي التطبيق',
  },
  {
    audience: 'companies',
    title: NOTIFICATION_AUDIENCE_LABELS.companies,
    description: 'إرسال الإشعار إلى الشركات والمتاجر المسجلة',
  },
];

const RECIPIENT_MODES: readonly RecipientMode[] = ['all', 'selected', 'location'];

@Component({
  selector: 'app-notification-audience-picker',
  imports: [OptionCard],
  templateUrl: './notification-audience-picker.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotificationAudiencePicker {
  readonly audience = input.required<NotificationAudience>();
  readonly recipientMode = input.required<RecipientMode>();
  readonly audienceChange = output<NotificationAudience>();
  readonly recipientModeChange = output<RecipientMode>();

  protected readonly audienceChoices = AUDIENCE_CHOICES;
  protected readonly recipientChoices = computed(() =>
    RECIPIENT_MODES.map((mode) => ({ mode, title: RECIPIENT_MODE_LABELS[this.audience()][mode] })),
  );
}
