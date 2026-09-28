import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { HttpMethod } from '../../models/http-method';

const METHOD_CLASSES: Record<HttpMethod, string> = {
  GET: 'bg-[#EAF5FE] text-[#0364B8] ring-[#0583EC]/25',
  POST: 'bg-[#E7F8F1] text-[#0B7A52] ring-[#17A672]/25',
  PUT: 'bg-[#FDF3E2] text-[#9A5B00] ring-[#F5A623]/30',
  PATCH: 'bg-[#F3EDFF] text-[#6D28D9] ring-[#8B5CF6]/25',
  DELETE: 'bg-[#FDECEC] text-[#B42318] ring-[#EB5757]/25',
};

@Component({
  selector: 'app-method-badge',
  templateUrl: './method-badge.html',
  host: { class: 'inline-flex shrink-0' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MethodBadge {
  readonly method = input.required<HttpMethod>();

  protected readonly toneClasses = computed(() => METHOD_CLASSES[this.method()]);
}
