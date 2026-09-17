import { RichTextCommand } from '../../models/rich-text-command';

export interface RichTextToolbarItem {
  readonly command: RichTextCommand;
  readonly ariaLabel: string;
  /** Visible text; an icon-only button leaves it empty. */
  readonly label: string;
  readonly icon?: string;
  /** The "•" or "1." drawn beside a list label. */
  readonly marker?: string;
  readonly markerClass?: string;
  /** Size, type and colour of the button, as each group of the design draws it. */
  readonly buttonClass: string;
  /** Pressed buttons get the blue tint; one-shot actions never do. */
  readonly canBePressed: boolean;
}

export interface RichTextToolbarGroup {
  readonly gapClass: string;
  readonly items: readonly RichTextToolbarItem[];
}

const HISTORY_BUTTON = 'size-7 justify-center rounded-lg text-text-secondary';
const BLOCK_BUTTON = 'h-6 px-2 rounded-lg text-[12px]/[16px] text-[#334155]';
const INLINE_BUTTON = 'size-7 justify-center rounded-lg text-[16px]/[24px] text-[#1e293b]';
const LIST_BUTTON = 'h-6 gap-1 px-2 rounded-lg text-[12px]/[16px] text-[#334155]';
const ALIGN_BUTTON = 'h-6 px-2 rounded-lg text-[12px]/[16px] text-[#475569]';

/** In DOM order, which RTL draws right to left: history first, alignment last. */
export const RICH_TEXT_TOOLBAR_GROUPS: readonly RichTextToolbarGroup[] = [
  {
    gapClass: 'gap-0',
    items: [
      {
        command: 'undo',
        ariaLabel: 'تراجع',
        label: '',
        icon: 'rich-text-undo',
        buttonClass: HISTORY_BUTTON,
        canBePressed: false,
      },
      {
        command: 'redo',
        ariaLabel: 'إعادة',
        label: '',
        icon: 'rich-text-redo',
        buttonClass: HISTORY_BUTTON,
        canBePressed: false,
      },
    ],
  },
  {
    gapClass: 'gap-0.5',
    items: [
      {
        command: 'heading1',
        ariaLabel: 'عنوان 1',
        label: 'H1',
        buttonClass: `${BLOCK_BUTTON} font-bold`,
        canBePressed: true,
      },
      {
        command: 'heading2',
        ariaLabel: 'عنوان 2',
        label: 'H2',
        buttonClass: `${BLOCK_BUTTON} font-bold`,
        canBePressed: true,
      },
      {
        command: 'heading3',
        ariaLabel: 'عنوان 3',
        label: 'H3',
        buttonClass: `${BLOCK_BUTTON} font-bold`,
        canBePressed: true,
      },
      {
        command: 'paragraph',
        ariaLabel: 'فقرة',
        label: 'فقرة',
        buttonClass: BLOCK_BUTTON,
        canBePressed: true,
      },
    ],
  },
  {
    gapClass: 'gap-0.5',
    items: [
      {
        command: 'bold',
        ariaLabel: 'عريض',
        label: 'B',
        buttonClass: `${INLINE_BUTTON} font-black`,
        canBePressed: true,
      },
      {
        command: 'italic',
        ariaLabel: 'مائل',
        label: 'I',
        buttonClass: `${INLINE_BUTTON} font-serif italic`,
        canBePressed: true,
      },
      {
        command: 'underline',
        ariaLabel: 'تسطير',
        label: 'U',
        buttonClass: `${INLINE_BUTTON} underline`,
        canBePressed: true,
      },
    ],
  },
  {
    gapClass: 'gap-0.5',
    items: [
      {
        command: 'bulletList',
        ariaLabel: 'قائمة نقطية',
        label: 'قائمة',
        marker: '•',
        markerClass: 'font-bold',
        buttonClass: LIST_BUTTON,
        canBePressed: true,
      },
      {
        command: 'numberedList',
        ariaLabel: 'قائمة مرقمة',
        label: 'مرقمة',
        marker: '1.',
        markerClass: 'font-mono text-[11px]',
        buttonClass: LIST_BUTTON,
        canBePressed: true,
      },
      {
        command: 'link',
        ariaLabel: 'إضافة رابط',
        label: 'رابط',
        icon: 'link-chain',
        buttonClass: `${LIST_BUTTON} text-primary`,
        canBePressed: false,
      },
    ],
  },
  {
    gapClass: 'gap-1',
    items: [
      {
        command: 'alignRight',
        ariaLabel: 'محاذاة لليمين',
        label: 'يمين',
        buttonClass: ALIGN_BUTTON,
        canBePressed: true,
      },
      {
        command: 'alignCenter',
        ariaLabel: 'توسيط',
        label: 'وسط',
        buttonClass: ALIGN_BUTTON,
        canBePressed: true,
      },
      {
        command: 'alignLeft',
        ariaLabel: 'محاذاة لليسار',
        label: 'يسار',
        buttonClass: ALIGN_BUTTON,
        canBePressed: true,
      },
      {
        command: 'justify',
        ariaLabel: 'ضبط',
        label: 'ضبط',
        buttonClass: ALIGN_BUTTON,
        canBePressed: true,
      },
    ],
  },
];

export const CLEAR_FORMAT_ITEM: RichTextToolbarItem = {
  command: 'clearFormat',
  ariaLabel: 'مسح التنسيق',
  label: '',
  icon: 'close-small',
  buttonClass: 'size-7 justify-center rounded-lg text-[#94a3b8]',
  canBePressed: false,
};
