import { StoryPicture } from '../models/story-picture';

/** A video shows its still frame, when the server has one. */
export function thumbnailOf(story: StoryPicture): string | null {
  return story.kind === 'image' ? story.url : story.posterUrl;
}
