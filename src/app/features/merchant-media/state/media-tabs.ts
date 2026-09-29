import { MediaKind } from '../models/media-kind';
import { MediaTab } from '../models/media-tab';
import { MediaTabView } from '../models/media-tab-view';
import { MerchantMediaItem } from '../models/merchant-media-item';

const TAB_KIND: Record<MediaTab, MediaKind | null> = {
  all: null,
  images: 'image',
  videos: 'video',
};

const TABS: readonly Omit<MediaTabView, 'count'>[] = [
  { value: 'all', label: 'الكل', icon: 'grid-four' },
  { value: 'images', label: 'الصور', icon: 'media' },
  { value: 'videos', label: 'الفيديوهات', icon: 'video' },
];

/** The main picture leads, as the place card shows it first. */
export function filterMediaByTab(
  items: readonly MerchantMediaItem[],
  tab: MediaTab,
): readonly MerchantMediaItem[] {
  const kind = TAB_KIND[tab];
  const shown = kind ? items.filter((item) => item.kind === kind) : items;
  return [...shown.filter((item) => item.isMain), ...shown.filter((item) => !item.isMain)];
}

export function buildMediaTabs(items: readonly MerchantMediaItem[]): readonly MediaTabView[] {
  return TABS.map((tab) => ({ ...tab, count: filterMediaByTab(items, tab.value).length }));
}
