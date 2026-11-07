import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AddButton } from '../add-button/add-button';
import { BackButton } from '../back-button/back-button';

/** `centered` fills the page; `flow` sits under the content above it, as the media page does. */
export type EmptyPagePlacement = 'centered' | 'flow';

const PLACEMENT_SKINS: Record<EmptyPagePlacement, { host: string; block: string }> = {
  centered: {
    // The host covers the page to centre the block; clicks must still reach the tabs under it.
    host: 'pointer-events-none absolute inset-0 flex items-center justify-center',
    block: 'pointer-events-auto w-[550px] max-w-full',
  },
  flow: { host: 'flex justify-center', block: 'max-w-full' },
};

/** "Nothing added yet" with a button to add the first one. */
@Component({
  selector: 'app-empty-page-message',
  imports: [AddButton, BackButton],
  templateUrl: './empty-page-message.html',
  host: { '[class]': 'skin().host' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EmptyPageMessage {
  readonly title = input.required<string>();
  /** The subscriptions design shows the title on its own, with no line under it and no button. */
  readonly description = input<string>('');
  readonly addLabel = input<string>('');
  readonly placement = input<EmptyPagePlacement>('centered');
  readonly add = output<void>();

  protected readonly skin = computed(() => PLACEMENT_SKINS[this.placement()]);
}
