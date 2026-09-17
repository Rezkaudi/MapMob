import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { PermissionAction } from '../../models/permission-action';
import { PermissionGrant } from '../../models/permission-grant';
import { PERMISSION_MODULES, toPermissionGrant } from '../../state/permission-modules';

interface ActionColumn {
  readonly action: PermissionAction;
  readonly label: string;
}

interface MatrixCell {
  readonly action: PermissionAction;
  /** Null where the section has no such action, so the matrix draws a dash. */
  readonly grant: PermissionGrant | null;
  readonly isChecked: boolean;
  readonly label: string;
}

/** Right to left, as the design heads them. */
const ACTION_COLUMNS: readonly ActionColumn[] = [
  { action: 'view', label: 'عرض' },
  { action: 'add', label: 'إضافة' },
  { action: 'edit', label: 'تعديل' },
  { action: 'delete', label: 'حذف' },
];

const COLUMN_WIDTHS = ['420px', '105px', '105px', '109px', '105px'];

@Component({
  selector: 'app-permission-matrix',
  templateUrl: './permission-matrix.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PermissionMatrix {
  readonly grants = input.required<readonly PermissionGrant[]>();
  readonly isReadOnly = input<boolean>(false);
  readonly grantToggled = output<PermissionGrant>();

  protected onBoxClick(event: Event, grant: PermissionGrant): void {
    // A disabled box turns grey; a read-only one keeps its blue tick and ignores the click.
    if (this.isReadOnly()) {
      event.preventDefault();
      return;
    }
    this.grantToggled.emit(grant);
  }

  protected readonly actionColumns = ACTION_COLUMNS;
  protected readonly columnWidths = COLUMN_WIDTHS;
  protected readonly rows = computed(() => {
    const held = new Set(this.grants());
    return PERMISSION_MODULES.map((module) => ({
      module,
      cells: ACTION_COLUMNS.map(({ action, label }): MatrixCell => {
        const grant = module.actions.includes(action) ? toPermissionGrant(module.id, action) : null;
        return {
          action,
          grant,
          isChecked: grant !== null && held.has(grant),
          label: `${label}: ${module.label}`,
        };
      }),
    }));
  });
}
