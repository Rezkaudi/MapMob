const BASE =
  'block w-full rounded border border-text-secondary bg-white text-start text-[14px]/[20px] text-text-primary outline-none focus:border-primary aria-invalid:border-closed';

/** The 46px outlined controls the offer and ad forms share, so every field looks the same. */
export const FORM_CONTROL_CLASSES = {
  text: `${BASE} h-[46px] px-4 placeholder:text-[#94a3b8]`,
  /** Leaves room on the left for the chevron. */
  select: `${BASE} h-[46px] appearance-none ps-4 pe-10`,
  /** Each form sets its own height and vertical padding. */
  textarea: `${BASE} resize-none px-4 placeholder:text-[#6b7280]`,
} as const;
