import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { CLOCK } from '../../../../core/config/clock';
import { FileSaver } from '../../../../shared/files/file-saver';
import { toCalendarDay } from '../../../../shared/formatting/calendar-day';
import { ConfirmActionCopy } from '../../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { EmptyPageMessage } from '../../../../shared/ui/empty-page-message/empty-page-message';
import { ErrorState } from '../../../../shared/ui/error-state/error-state';
import { PageHeader } from '../../../../shared/ui/page-header/page-header';
import { StatCard } from '../../../../shared/ui/stat-card/stat-card';
import { TablePagination } from '../../../../shared/ui/table-pagination/table-pagination';
import { Toast } from '../../../../shared/ui/toast/toast';
import { PackagePlan } from '../../models/package-plan';
import { PlanDraft } from '../../models/plan-draft';
import { SubscriptionTab } from '../../models/subscription-tab';
import { PackagesStore } from '../../state/packages.store';
import { SubscriptionsStore } from '../../state/subscriptions.store';
import { buildPlanDeleteCopy, buildPlanStatusCopy } from '../../ui/plan-dialog-copy';
import { BillingCycle } from '../../models/billing-cycle';
import { BillingCycleToggle } from '../../ui/billing-cycle-toggle/billing-cycle-toggle';
import { PlanCard } from '../../ui/plan-card/plan-card';
import { PlanFormDialog } from '../../ui/plan-form-dialog/plan-form-dialog';
import { SubscriptionTable } from '../../ui/subscription-table/subscription-table';
import { SubscriptionTabs } from '../../ui/subscription-tabs/subscription-tabs';
import { SubscriptionToolbar } from '../../ui/subscription-toolbar/subscription-toolbar';

/** A package waiting on the admin to confirm what should happen to it. */
interface PendingPlanAction {
  readonly plan: PackagePlan;
  readonly kind: 'status' | 'delete';
}

@Component({
  selector: 'app-subscription-hub',
  imports: [
    ConfirmActionDialog,
    EmptyPageMessage,
    ErrorState,
    PageHeader,
    BillingCycleToggle,
    PlanCard,
    PlanFormDialog,
    StatCard,
    SubscriptionTable,
    SubscriptionTabs,
    SubscriptionToolbar,
    TablePagination,
    Toast,
  ],
  templateUrl: './subscription-hub.html',
  host: { class: 'flex min-h-full flex-col' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SubscriptionHub {
  private readonly fileSaver = inject(FileSaver);
  private readonly clock = inject(CLOCK);

  protected readonly store = inject(PackagesStore);
  protected readonly records = inject(SubscriptionsStore);
  protected readonly selectedTab = signal<SubscriptionTab>('packages');
  protected readonly cycle = signal<BillingCycle>('monthly');
  protected readonly pendingAction = signal<PendingPlanAction | null>(null);
  /** The package the edit dialog is open on, if any. */
  protected readonly editedPlan = signal<PackagePlan | null>(null);

  protected readonly confirmCopy = computed<ConfirmActionCopy | null>(() => {
    const pending = this.pendingAction();
    if (!pending) {
      return null;
    }
    return pending.kind === 'delete'
      ? buildPlanDeleteCopy(pending.plan)
      : buildPlanStatusCopy(pending.plan);
  });

  constructor() {
    this.store.load();
    this.records.loadSubscriptions();
  }

  protected editPlan(plan: PackagePlan): void {
    this.editedPlan.set(plan);
  }

  protected cancelEdit(): void {
    this.editedPlan.set(null);
    this.store.clearSaveError();
  }

  protected async savePlan(draft: PlanDraft): Promise<void> {
    const plan = this.editedPlan();
    if (plan && (await this.store.savePlan(plan.id, draft))) {
      this.editedPlan.set(null);
    }
  }

  protected askToChangeStatus(plan: PackagePlan): void {
    this.pendingAction.set({ plan, kind: 'status' });
  }

  protected askToDelete(plan: PackagePlan): void {
    this.pendingAction.set({ plan, kind: 'delete' });
  }

  protected cancelPendingAction(): void {
    this.pendingAction.set(null);
    this.store.clearSaveError();
  }

  protected async confirmPendingAction(): Promise<void> {
    const pending = this.pendingAction();
    if (!pending) {
      return;
    }
    const done =
      pending.kind === 'delete'
        ? await this.store.deletePlan(pending.plan.id)
        : await this.store.setPlanActive(pending.plan.id, !pending.plan.isActive);
    if (done) {
      this.pendingAction.set(null);
    }
  }

  protected async exportSubscriptions(): Promise<void> {
    const file = await this.records.exportSubscriptions();
    if (file) {
      this.fileSaver.save(file, `subscriptions-${toCalendarDay(this.clock())}.csv`);
    }
  }
}
