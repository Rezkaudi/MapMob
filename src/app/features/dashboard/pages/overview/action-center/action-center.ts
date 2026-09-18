import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AppIcon } from '../../../../../shared/ui/app-icon/app-icon';
import { Skeleton } from '../../../../../shared/ui/skeleton/skeleton';
import { ActionItem, ActionItemTone } from '../../../models/action-item';

/** Tinted row background per tone, straight from the design. */
const ROW_CLASSES: Record<ActionItemTone, string> = {
  error: 'bg-[rgba(255,218,214,0.3)]',
  warning: 'bg-[rgba(255,185,95,0.2)]',
  info: 'bg-[rgba(34,145,238,0.2)]',
  success: 'bg-[rgba(16,185,129,0.2)]',
};

const ICON_CLASSES: Record<ActionItemTone, string> = {
  error: 'bg-[#ff8174]',
  warning: 'bg-[#ffb564]',
  info: 'bg-[#2291ee]',
  success: 'bg-status-success',
};

/** Rows drawn while the list loads. */
const PLACEHOLDER_ROWS = [0, 1, 2, 3];

/** The page that clears each queue. An id with no page here loses its review button. */
const REVIEW_ROUTES: Record<string, string> = {
  complaints: '/complaints',
  'reported-reviews': '/reviews',
  'pending-places': '/places',
  'expiring-subscriptions': '/subscriptions',
};

const ICON_NAMES: Record<ActionItemTone, string> = {
  error: 'complaints',
  warning: 'reviews',
  info: 'places',
  success: 'calendar',
};

@Component({
  selector: 'app-action-center',
  imports: [AppIcon, RouterLink, Skeleton],
  templateUrl: './action-center.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActionCenter {
  readonly items = input.required<readonly ActionItem[]>();
  readonly isLoading = input<boolean>(false);

  protected readonly rows = computed(() =>
    this.items().map((item) => ({ item, reviewRoute: REVIEW_ROUTES[item.id] ?? null })),
  );

  protected readonly placeholderRows = PLACEHOLDER_ROWS;

  protected readonly rowClasses = ROW_CLASSES;
  protected readonly iconClasses = ICON_CLASSES;
  protected readonly iconNames = ICON_NAMES;
}
