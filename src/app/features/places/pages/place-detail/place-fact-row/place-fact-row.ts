import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** One "label … value" line of the summary cards beside the place page. */
@Component({
  selector: 'app-place-fact-row',
  templateUrl: './place-fact-row.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceFactRow {
  readonly label = input.required<string>();
}
