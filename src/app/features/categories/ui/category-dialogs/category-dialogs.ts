import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CrudDialogRequest } from '../../../../shared/state/crud-dialog-request';
import { ConfirmActionDialog } from '../../../../shared/ui/confirm-action-dialog/confirm-action-dialog';
import { SelectOption } from '../../../../shared/ui/select-field/select-option';
import { Category } from '../../models/category';
import { DEFAULT_CATEGORY_COLOR } from '../../models/category-color';
import { DEFAULT_CATEGORY_ICON } from '../../models/category-icon';
import { CategoryDraft } from '../../models/category-draft';
import { buildCategoryConfirmCopy, buildCategoryFormCopy } from '../category-dialog-copy';
import { CategoryFormDialog } from '../category-form-dialog/category-form-dialog';

/** The add dialog opens on a main category with the icon the design marks as the default. */
const NEW_CATEGORY_DRAFT: CategoryDraft = {
  name: '',
  kind: 'main',
  parentId: null,
  icon: DEFAULT_CATEGORY_ICON,
  color: DEFAULT_CATEGORY_COLOR,
};

@Component({
  selector: 'app-category-dialogs',
  imports: [CategoryFormDialog, ConfirmActionDialog],
  templateUrl: './category-dialogs.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CategoryDialogs {
  readonly request = input.required<CrudDialogRequest<Category> | null>();
  readonly parentOptions = input.required<readonly SelectOption[]>();
  readonly isBusy = input<boolean>(false);
  readonly draftSubmitted = output<CategoryDraft>();
  readonly confirmed = output<void>();
  readonly closed = output<void>();

  protected readonly form = computed(() => {
    const request = this.request();
    if (request?.type !== 'form') {
      return null;
    }
    const entry = request.entry;
    return {
      mode: request.mode,
      copy: buildCategoryFormCopy(request.mode),
      draft: entry
        ? {
            name: entry.name,
            kind: entry.kind,
            parentId: entry.parentId,
            icon: entry.icon,
            color: entry.color,
          }
        : NEW_CATEGORY_DRAFT,
    };
  });

  protected readonly confirmCopy = computed(() => {
    const request = this.request();
    return request?.type === 'confirm'
      ? buildCategoryConfirmCopy(request.action, request.entry)
      : null;
  });
}
