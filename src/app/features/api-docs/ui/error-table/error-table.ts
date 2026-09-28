import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { ApiErrorCase } from '../../models/api-error-case';

@Component({
  selector: 'app-error-table',
  templateUrl: './error-table.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ErrorTable {
  readonly cases = input.required<readonly ApiErrorCase[]>();

  protected bodyOf(errorCase: ApiErrorCase): string {
    return JSON.stringify(errorCase.example);
  }
}
