import { StoryVisibilityAction } from '../../../shared/models/story-visibility-action';

/** The drawer, or one of the three questions asked before a story changes. */
export type StoryOverlayKind = 'view' | StoryVisibilityAction | 'delete';
