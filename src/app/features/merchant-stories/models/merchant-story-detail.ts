import { StoryDetailView } from '../../../shared/models/story-detail-view';
import { StoryCardView } from './story-card-view';

/** The drawer of the owner's page, which still needs the whole story to delete it. */
export interface MerchantStoryDetail extends StoryDetailView {
  readonly card: StoryCardView;
}
