import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { LazyImage } from '../../../../shared/ui/lazy-image/lazy-image';

/** The 32px rounded logo beside a platform or a store name. */
@Component({
  selector: 'app-brand-logo',
  imports: [LazyImage],
  templateUrl: './brand-logo.html',
  host: { class: 'inline-flex shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BrandLogo {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null>(null);

  protected readonly initial = computed(() => this.name().trim().charAt(0).toUpperCase());
}
