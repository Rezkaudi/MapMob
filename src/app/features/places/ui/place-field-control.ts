import { Directive, ElementRef, computed, inject, input } from '@angular/core';

/** The first two form cards outline fields in #64748B; the rest in the softer #C0C7D5. */
export type PlaceFieldTone = 'strong' | 'soft';

const BASE_CLASSES =
  'w-full rounded border bg-white px-4 text-[14px] text-text-primary outline-none transition-colors placeholder:text-[#94a3b8] focus:border-primary focus:ring-2 focus:ring-primary/20 [&.ng-touched.ng-invalid]:border-closed';

const TONE_CLASSES: Record<PlaceFieldTone, string> = {
  strong: 'border-[#64748b]',
  soft: 'border-[#c0c7d5]',
};

const TAG_CLASSES: Record<string, string> = {
  TEXTAREA: 'min-h-[120px] py-3 [field-sizing:content]',
  SELECT:
    "h-[46px] cursor-pointer appearance-none pl-10 has-[option[value='']:checked]:text-[#94a3b8] [&>option]:text-text-primary",
};
const LINE_FIELD_CLASSES = 'h-[46px]';

/** The look of every field in the place form, so each input only states what differs. */
@Directive({
  selector: '[appPlaceFieldControl]',
  host: {
    '[class]': 'classes()',
    '[attr.dir]': 'isLatin() ? "ltr" : null',
  },
})
export class PlaceFieldControl {
  readonly fieldTone = input<PlaceFieldTone>('soft');
  /** Phones and links read left to right and start at the left edge, as the frame draws them. */
  readonly isLatin = input<boolean>(false);

  private readonly tagClasses =
    TAG_CLASSES[inject<ElementRef<HTMLElement>>(ElementRef).nativeElement.tagName] ??
    LINE_FIELD_CLASSES;

  protected readonly classes = computed(() =>
    [
      BASE_CLASSES,
      TONE_CLASSES[this.fieldTone()],
      this.tagClasses,
      this.isLatin() ? 'text-left' : 'text-right',
    ].join(' '),
  );
}
