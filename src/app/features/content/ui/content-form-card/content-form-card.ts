import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The white card that holds a content page's fields, 32px in and 32px apart. */
@Component({
  selector: 'app-content-form-card',
  template: `
    <section
      class="flex flex-col gap-8 rounded-2xl border border-border bg-surface p-8 shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]"
    >
      <ng-content />
    </section>
  `,
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContentFormCard {}
