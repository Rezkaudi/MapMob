import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The small caps title above each part of an endpoint. */
@Component({
  selector: 'app-section-label',
  template: '<ng-content />',
  host: {
    class:
      'mb-2 flex items-center gap-2 text-[12px] font-bold tracking-[0.08em] text-text-secondary uppercase',
  },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionLabel {}
