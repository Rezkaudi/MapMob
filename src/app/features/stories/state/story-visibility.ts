import { StoryStatus } from '../../../shared/models/story-status';
import { StoryVisibilityAction } from '../../../shared/models/story-visibility-action';

const ACTION_BY_STATUS: Record<StoryStatus, StoryVisibilityAction | null> = {
  active: 'hide',
  hidden: 'show',
  expired: null,
};

/** A running story can be hidden, a hidden one shown; one that ran out is left as it is. */
export function visibilityActionFor(status: StoryStatus): StoryVisibilityAction | null {
  return ACTION_BY_STATUS[status];
}
