import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { AppIcon } from '../../../../shared/ui/app-icon/app-icon';
import { MediaKind } from '../../models/media-kind';

const PICKED_SEGMENT = 'bg-white text-primary shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]';
const IDLE_SEGMENT = 'text-text-secondary hover:text-text-primary';

const KIND_OPTIONS: readonly {
  kind: MediaKind;
  label: string;
  icon: string;
  fullNotice: string;
}[] = [
  {
    kind: 'image',
    label: 'صورة',
    icon: 'media',
    fullNotice: 'وصلت للحد المتاح من الصور في باقتك',
  },
  {
    kind: 'video',
    label: 'فيديو',
    icon: 'video',
    fullNotice: 'وصلت للحد المتاح من الفيديوهات في باقتك',
  },
];

/** The 44px grey "نوع الوسائط" track with one raised white segment. */
@Component({
  selector: 'app-media-kind-choice',
  imports: [AppIcon],
  templateUrl: './media-kind-choice.html',
  host: { class: 'block' },
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MediaKindChoice {
  readonly selected = input.required<MediaKind>();
  readonly canAddImage = input.required<boolean>();
  readonly canAddVideo = input.required<boolean>();
  readonly selectedChange = output<MediaKind>();

  protected readonly segments = computed(() =>
    KIND_OPTIONS.map((option) => {
      const isPicked = option.kind === this.selected();
      const hasRoom = option.kind === 'image' ? this.canAddImage() : this.canAddVideo();
      return {
        ...option,
        isPicked,
        isDisabled: !hasRoom,
        title: hasRoom ? null : option.fullNotice,
        classes: isPicked ? PICKED_SEGMENT : IDLE_SEGMENT,
      };
    }),
  );
}
