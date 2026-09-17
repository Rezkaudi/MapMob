import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { Toast } from '../../../../shared/ui/toast/toast';
import { ContentPageStatus } from '../../models/content-page-status';

interface SavedCopy {
  readonly title: string;
  readonly message: string;
}

const SAVED_COPY: Record<ContentPageStatus, SavedCopy> = {
  published: { title: 'تم حفظ التغييرات', message: 'ستظهر التغييرات للمستخدمين داخل التطبيق.' },
  draft: { title: 'تم حفظ المسودة', message: 'لن تظهر التغييرات للمستخدمين حتى تحفظها وتنشرها.' },
};

/** The confirmation or error that floats up after a content page is saved. */
@Component({
  selector: 'app-content-save-toasts',
  imports: [Toast],
  templateUrl: './content-save-toasts.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentSaveToasts {
  readonly savedStatus = input<ContentPageStatus | null>(null);
  readonly saveError = input<string | null>(null);
  readonly savedDismissed = output<void>();
  readonly errorDismissed = output<void>();

  protected readonly savedCopy = computed(() => {
    const status = this.savedStatus();
    return status ? SAVED_COPY[status] : null;
  });
}
