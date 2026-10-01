import { PagedQuery } from '../../../core/models/paged-query';
import { StoryStatus } from '../../../shared/models/story-status';

/** `search` matches the place name. */
export interface StoryQuery extends PagedQuery {
  readonly status?: StoryStatus;
}
