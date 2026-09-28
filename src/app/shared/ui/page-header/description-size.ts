/** Reviews write the description at 14px, merchant settings at 12px; the rest use 16px. */
export type DescriptionSize = 'regular' | 'small' | 'caption';

export const DESCRIPTION_SIZE_CLASSES: Record<DescriptionSize, string> = {
  regular: 'text-[16px]/[19px]',
  small: 'text-[14px]/[20px]',
  caption: 'text-[12px]/[18px]',
};
