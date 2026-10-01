import { describeStoryDay } from '../../../shared/formatting/story-time-text';
import { formatStoryViews } from '../../../shared/formatting/story-views-text';
import { STORY_STATUS_LABELS } from '../../../shared/models/story-status';
import { StoryVisibilityAction } from '../../../shared/models/story-visibility-action';
import { thumbnailOf } from '../../../shared/state/story-thumbnail';
import { ConfirmActionContext } from '../../../shared/ui/confirm-action-dialog/confirm-action-context';
import { ConfirmActionCopy } from '../../../shared/ui/confirm-action-dialog/confirm-action-copy';
import { StoryEntry } from '../models/story-entry';

const HALO_GLYPH_SIZE = 24;

type ConfirmKind = StoryVisibilityAction | 'delete';
type CopyWithoutContext = Omit<ConfirmActionCopy, 'context'>;

/** The hide frame also warns "لا يمكن التراجع عنه", copied from delete; a hidden story can be shown again, so it is left out. */
const VISIBILITY_COPY: Record<StoryVisibilityAction, CopyWithoutContext> = {
  hide: {
    title: 'إخفاء القصة',
    question: 'لن تظهر هذه القصة للمستخدمين على MapMob بعد إخفائها.',
    confirmLabel: 'إخفاء القصة',
    tone: 'warning',
    icon: { name: 'eye-hide', size: HALO_GLYPH_SIZE },
  },
  show: {
    title: 'إظهار القصة',
    question: 'هل أنت متأكد من إظهار القصة مرة أخرى؟ ستصبح القصة مرئية للمستخدمين مجدداً.',
    confirmLabel: 'إظهار القصة',
    tone: 'success',
    icon: { name: 'eye-clarity', size: HALO_GLYPH_SIZE },
  },
};

const DELETE_COPY: CopyWithoutContext = {
  title: 'حذف القصة',
  question: 'هل أنت متأكد من حذف هذه القصة؟',
  detail: 'تنبيه: إجراء نهائي لا يمكن التراجع عنه',
  detailAppearance: 'callout',
  confirmLabel: 'حذف القصة',
  tone: 'critical',
};

function nameOf(story: StoryEntry, now: Date): string {
  return `${story.place.name} • قصة ${describeStoryDay(story.publishedAt, now)}`;
}

function deleteContext(story: StoryEntry, now: Date): ConfirmActionContext {
  return {
    lines: [nameOf(story, now), `حصلت القصة على ${formatStoryViews(story.viewCount)}`],
    imageUrl: thumbnailOf(story),
  };
}

function visibilityContext(story: StoryEntry, now: Date): ConfirmActionContext {
  return {
    lines: [nameOf(story, now), `حصلت هذه القصة على ${formatStoryViews(story.viewCount)}`],
    imageUrl: thumbnailOf(story),
    tag: `الحالة: ${STORY_STATUS_LABELS[story.status]}`,
  };
}

export function buildStoryConfirmCopy(
  kind: ConfirmKind,
  story: StoryEntry,
  now: Date,
): ConfirmActionCopy {
  if (kind === 'delete') {
    return { ...DELETE_COPY, context: deleteContext(story, now) };
  }
  return { ...VISIBILITY_COPY[kind], context: visibilityContext(story, now) };
}
