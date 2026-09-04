import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

const INITIALS_LENGTH = 2;

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Avatar {
  readonly name = input.required<string>();
  readonly imageUrl = input<string | null>(null);

  protected readonly initials = computed(() => this.name().trim().slice(0, INITIALS_LENGTH));
}
