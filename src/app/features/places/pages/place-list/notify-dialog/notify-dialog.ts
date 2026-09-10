import { ChangeDetectionStrategy, Component, computed, input, output, signal } from '@angular/core';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { NotificationDraft } from '../notification-draft';
import { PriorityPicker } from './priority-picker/priority-picker';
import { NotificationPriority } from '../notification-priority';

const MESSAGE_LIMIT = 500;

@Component({
  selector: 'app-notify-dialog',
  imports: [AppIcon, PriorityPicker],
  templateUrl: './notify-dialog.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NotifyDialog {
  readonly selectedCount = input.required<number>();
  readonly sent = output<NotificationDraft>();
  readonly cancelled = output<void>();

  protected readonly messageLimit = MESSAGE_LIMIT;

  protected readonly title = signal('');
  protected readonly priority = signal<NotificationPriority>('general');
  protected readonly message = signal('');
  protected readonly shouldSendToDashboard = signal(true);

  protected readonly recipientsLabel = computed(() => `${this.selectedCount()} متاجر`);
  protected readonly messageCounter = computed(() => `${this.message().length}/${MESSAGE_LIMIT}`);
  protected readonly canSend = computed(
    () => this.title().trim().length > 0 && this.message().trim().length > 0,
  );

  protected setTitle(event: Event): void {
    this.title.set((event.target as HTMLInputElement).value);
  }

  protected setMessage(event: Event): void {
    this.message.set((event.target as HTMLTextAreaElement).value);
  }

  protected setDashboardDelivery(event: Event): void {
    this.shouldSendToDashboard.set((event.target as HTMLInputElement).checked);
  }

  protected send(): void {
    if (!this.canSend()) {
      return;
    }
    this.sent.emit({
      title: this.title().trim(),
      priority: this.priority(),
      message: this.message().trim(),
      shouldSendToDashboard: this.shouldSendToDashboard(),
    });
  }
}
