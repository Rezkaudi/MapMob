import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const SIZE_PX = 32;

/** The 32px rounded tile in the first table column: the place logo, or its initial. */
@Component({
  selector: 'app-place-logo',
  templateUrl: './place-logo.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PlaceLogo {
  readonly name = input.required<string>();
  readonly imageUrl = input<string>('');

  protected readonly sizeInPixels = `${SIZE_PX}px`;
  protected readonly initial = computed(() => this.name().trim().charAt(0));
}
