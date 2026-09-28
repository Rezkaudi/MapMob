import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';

@Component({
  selector: 'app-auth-heading',
  imports: [AppIcon, RouterLink],
  templateUrl: './auth-heading.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthHeading {
  private readonly router = inject(Router);

  readonly title = input.required<string>();
  readonly description = input.required<string>();
  /** Draws "العودة إلى تسجيل الدخول" above the title when set. */
  readonly backRoute = input<string | null>(null);

  /** Parsed, so a query such as ?role=merchant survives instead of being encoded. */
  protected readonly backLink = computed(() => {
    const route = this.backRoute();
    return route ? this.router.parseUrl(route) : null;
  });
  /** The login frame spaces its description by 0.5px; the others do not. */
  readonly hasSpacedDescription = input<boolean>(false);

  // The login's spaced text box is 380px; the others are 396px and run past the column's left edge.
  protected readonly descriptionClass = computed(() =>
    this.hasSpacedDescription()
      ? 'w-[380px] max-w-full tracking-[0.5px]'
      : 'w-[396px] max-w-[calc(100%+14px)]',
  );
}
