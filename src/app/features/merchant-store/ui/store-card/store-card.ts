import { Directive } from '@angular/core';

/** The white card of the store page. The outline sits inside the box, as a Figma stroke does. */
@Directive({
  selector: '[appStoreCard]',
  host: {
    class:
      'bg-white shadow-[0_4px_30px_0_rgba(0,0,0,0.08)] outline-1 -outline-offset-1 outline-border',
  },
})
export class StoreCard {}
