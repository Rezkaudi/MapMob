import { StoryQuery } from './story-query';

export interface StoryExportRequest {
  readonly query: StoryQuery;
  /** The ticked rows. Empty means every story the filters match. */
  readonly ids: readonly string[];
}
