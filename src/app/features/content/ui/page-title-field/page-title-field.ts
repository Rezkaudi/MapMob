import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { touchedError } from '../../../../shared/forms/touched-error';
import { ContentFieldLabel } from '../content-field-label/content-field-label';

const MISSING_TITLE_MESSAGE = 'اكتب عنوان الصفحة';

/** "عنوان الصفحة": the first field of every content page editor. */
@Component({
  selector: 'app-page-title-field',
  imports: [ContentFieldLabel, ReactiveFormsModule],
  templateUrl: './page-title-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.Default,
})
export class PageTitleField {
  readonly control = input.required<FormControl<string>>();

  protected get error(): string | null {
    return touchedError(this.control(), MISSING_TITLE_MESSAGE);
  }
}
