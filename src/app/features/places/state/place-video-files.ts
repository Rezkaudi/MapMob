import { MediaFile } from '../../../shared/ui/media-picker/media-file';
import { PlaceVideo } from '../models/place-video';

/** Videos already on the server, as the picker shows them when the form edits. */
export function toSavedVideoFiles(videos: readonly PlaceVideo[]): MediaFile[] {
  return videos.map((video) => ({
    id: video.id,
    name: video.url.split('/').at(-1) ?? video.id,
    sizeInBytes: 0,
    file: null,
    previewUrl: video.url,
    posterUrl: video.posterUrl,
  }));
}
