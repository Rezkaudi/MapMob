import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  OnInit,
  computed,
  input,
  output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { hasText } from '../../../../shared/forms/has-text';
import { touchedError } from '../../../../shared/forms/touched-error';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { ToggleSwitch } from '../../../../shared/ui/toggle-switch/toggle-switch';
import { PermissionGrant } from '../../models/permission-grant';
import { RoleDialogState } from '../../models/role-dialog-state';
import { RoleDraft } from '../../models/role-draft';
import { allPermissionGrants } from '../../state/permission-modules';
import { NEW_ROLE_GRANTS, toggleGrant } from '../../state/role-grants';
import { PermissionMatrix } from '../permission-matrix/permission-matrix';
import { SETTINGS_DIALOG_INPUT_CLASSES } from '../settings-control-classes';
import { roleDialogCopy } from './role-dialog-copy';

/** The 896px role card with the name, status, description and the permission matrix. */
@Component({
  selector: 'app-role-dialog',
  imports: [AppIcon, PermissionMatrix, ReactiveFormsModule, ToggleSwitch],
  templateUrl: './role-dialog.html',
  // Field errors read the form's touched state, which signals do not track.
  changeDetection: ChangeDetectionStrategy.Default,
})
export class RoleDialog implements OnInit {
  readonly dialog = input.required<RoleDialogState>();
  readonly isBusy = input<boolean>(false);
  readonly saveError = input<string | null>(null);
  readonly saved = output<RoleDraft>();
  readonly closed = output<void>();

  protected readonly form = new FormGroup({
    name: new FormControl('', { nonNullable: true, validators: [Validators.required, hasText] }),
    description: new FormControl('', { nonNullable: true }),
    isActive: new FormControl(true, { nonNullable: true }),
    grants: new FormControl<readonly PermissionGrant[]>(NEW_ROLE_GRANTS, {
      nonNullable: true,
      validators: Validators.required,
    }),
  });
  protected readonly copy = computed(() => roleDialogCopy(this.dialog()));
  protected readonly isReadOnly = computed(() => this.dialog().mode === 'view');
  protected readonly inputClasses = SETTINGS_DIALOG_INPUT_CLASSES;

  ngOnInit(): void {
    const dialog = this.dialog();
    if (dialog.mode === 'add') {
      return;
    }
    const { name, description, isActive, isFullAccess, grants } = dialog.role;
    this.form.setValue({
      name,
      description,
      isActive,
      grants: isFullAccess ? allPermissionGrants() : grants,
    });
    if (dialog.mode === 'view') {
      this.form.disable();
    }
  }

  protected get nameError(): string | null {
    return touchedError(this.form.controls.name, 'اكتب اسم الدور');
  }

  protected get grantsError(): string | null {
    return touchedError(this.form.controls.grants, 'اختر صلاحية واحدة على الأقل');
  }

  protected setActive(isActive: boolean): void {
    this.form.controls.isActive.setValue(isActive);
  }

  protected toggle(grant: PermissionGrant): void {
    this.setGrants(toggleGrant(this.form.controls.grants.value, grant));
  }

  protected selectAll(): void {
    this.setGrants(allPermissionGrants());
  }

  protected clearAll(): void {
    this.setGrants([]);
  }

  protected submit(): void {
    this.form.markAllAsTouched();
    if (this.isReadOnly() || this.form.invalid) {
      return;
    }
    const { name, description, isActive, grants } = this.form.getRawValue();
    this.saved.emit({ name: name.trim(), description: description.trim(), isActive, grants });
  }

  @HostListener('document:keydown.escape')
  protected closeOnEscape(): void {
    this.closed.emit();
  }

  private setGrants(grants: readonly PermissionGrant[]): void {
    this.form.controls.grants.setValue(grants);
    this.form.controls.grants.markAsTouched();
  }
}
