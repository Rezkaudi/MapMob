// Figma draws the 1px stroke inside the 45px box; a CSS border already sits inside `h-[45px]`.
export const AUTH_FIELD_BOX_CLASSES =
  'flex h-[45px] w-full items-center gap-0 rounded-lg border border-text-secondary px-[11px] focus-within:border-primary focus-within:ring-1 focus-within:ring-primary';

// `dir="ltr"` flips the default alignment, so the right edge is set on purpose.
export const AUTH_FIELD_INPUT_CLASSES =
  'font-latin min-w-0 flex-1 border-0 bg-transparent text-right text-[12px] text-text-primary outline-none placeholder:text-placeholder/60';

export const AUTH_FIELD_LABEL_CLASSES =
  'text-right text-[14px]/[20px] font-medium tracking-[0.7px] text-text-primary';
