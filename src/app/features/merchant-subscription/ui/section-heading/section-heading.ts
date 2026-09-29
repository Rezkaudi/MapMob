import { ChangeDetectionStrategy, Component, input } from '@angular/core';

/** "استخدام الباقة", "الباقات المتاحة", "سجل الاشتراكات": an 18px title over a 12px line. */
@Component({
  selector: 'app-section-heading',
  templateUrl: './section-heading.html',
  host: { class: 'flex flex-col gap-0.5 text-start' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SectionHeading {
  readonly title = input.required<string>();
  readonly description = input.required<string>();
}
