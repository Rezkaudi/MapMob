import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const FULL_BAR_PERCENT = 100;

/** The 291px "الباقة الحالية" chip with its progress bar, above every quota-capped field. */
@Component({
  selector: 'app-package-quota-badge',
  templateUrl: './package-quota-badge.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PackageQuotaBadge {
  readonly packageLabel = input.required<string>();
  readonly used = input.required<number>();
  /** How many the current package allows. */
  readonly limit = input.required<number>();
  /** What is being counted: "صور", "فيديو", "منتجات وخدمات". */
  readonly noun = input.required<string>();

  protected readonly quotaLabel = computed(() => `${this.used()} / ${this.limit()} ${this.noun()}`);
  /** Moving a place to a smaller package can leave it holding more than the package allows. */
  protected readonly isOverLimit = computed(() => this.used() > this.limit());
  protected readonly fillWidth = computed(() => {
    if (this.limit() <= 0) {
      return '0%';
    }
    const share = (this.used() / this.limit()) * FULL_BAR_PERCENT;
    return `${Math.min(share, FULL_BAR_PERCENT)}%`;
  });
}
