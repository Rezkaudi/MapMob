import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { touchedError } from '../../state/touched-error';

/** `regular` is the 60px phone, email and address box; `compact` is the 52px social link box. */
export type ContactChannelSize = 'regular' | 'compact';

interface SizeSkin {
  readonly label: string;
  readonly box: string;
  readonly iconSlot: string;
  readonly input: string;
}

const SIZE_SKINS: Record<ContactChannelSize, SizeSkin> = {
  regular: {
    label: 'text-[13px]/[22px] text-[#374151]',
    box: 'h-[60px] ps-[23px] pe-[14px]',
    iconSlot: 'w-3.5',
    input: 'h-[42px] text-right text-[13.5px]/[24px] text-[#1f2937]',
  },
  compact: {
    label: 'font-cairo text-[12px]/[16px] text-[#1e293b]',
    box: 'h-[52px] ps-[17px] pe-[14px]',
    iconSlot: 'w-5',
    input: 'h-[34px] text-left font-inter text-[12px]/[16px] text-[#1e293b]',
  },
};

/** One way to reach MapMob: a label, then a grey box holding the icon and the outlined input. */
@Component({
  selector: 'app-contact-channel-field',
  imports: [AppIcon, ReactiveFormsModule],
  templateUrl: './contact-channel-field.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.Default,
})
export class ContactChannelField {
  readonly label = input.required<string>();
  readonly inputId = input.required<string>();
  readonly control = input.required<FormControl<string>>();
  readonly type = input<'text' | 'tel' | 'email' | 'url'>('text');
  /** A one-colour glyph, drawn in the primary blue. */
  readonly icon = input<string>('');
  /** The phone glyph is drawn at 14px; the mail and pin glyphs fill 16px. */
  readonly iconSize = input<number>(16);
  /** A full-colour logo file, used as is. */
  readonly brandIcon = input<string>('');
  readonly size = input<ContactChannelSize>('regular');
  readonly isRequired = input<boolean>(false);
  /** Phone numbers, emails and links read left to right; an address does not. */
  readonly isLatin = input<boolean>(true);
  readonly errorMessage = input<string>('');

  protected readonly skin = computed(() => SIZE_SKINS[this.size()]);
  protected readonly brandIconUrl = computed(() => `assets/icons/${this.brandIcon()}.svg`);

  protected get error(): string | null {
    return this.errorMessage() ? touchedError(this.control(), this.errorMessage()) : null;
  }
}
