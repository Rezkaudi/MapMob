import { Directive, booleanAttribute, input } from '@angular/core';

/** The grey #F2F4F6 field of the store page; a touched invalid field gets a red ring. */
const FIELD_CLASSES =
  'w-full rounded-lg bg-[#f2f4f6] text-[14px] outline-none transition-shadow placeholder:text-placeholder focus-visible:ring-2 focus-visible:ring-primary/40 [&.ng-invalid.ng-touched]:ring-1 [&.ng-invalid.ng-touched]:ring-closed';

@Directive({
  selector: 'input[appStoreInput], textarea[appStoreInput]',
  host: {
    class: FIELD_CLASSES,
    '[attr.dir]': "isLatin() ? 'ltr' : null",
    '[class.text-left]': 'isLatin()',
    '[class.text-text-primary]': '!isMuted()',
    '[class.text-text-secondary]': 'isMuted()',
  },
})
export class StoreInput {
  /** Phones, emails and links: written left to right from the left edge, as the design draws them. */
  readonly isLatin = input(false, { transform: booleanAttribute });
  /** The description's text is drawn in the secondary grey. */
  readonly isMuted = input(false, { transform: booleanAttribute });
}
