const FILLED_CONTROL_BASE =
  'block h-9 w-full rounded bg-[#f2f4f6] ps-4 text-[14px]/[20px] text-text-primary outline-none placeholder:text-[#9ca3af] focus:ring-2 focus:ring-primary/40 aria-invalid:ring-1 aria-invalid:ring-closed disabled:cursor-not-allowed disabled:opacity-60';

/** The grey 36px box every settings field draws. */
export const SETTINGS_INPUT_CLASSES = `${FILLED_CONTROL_BASE} pe-4`;

/** Leaves room on the left for the 16px icon the field draws at 12px from the edge. */
export const SETTINGS_INPUT_WITH_ICON_CLASSES = `${FILLED_CONTROL_BASE} pe-10`;

/** A native select drawn as the grey box, with room on the left for the chevron. */
export const SETTINGS_SELECT_CLASSES = `${FILLED_CONTROL_BASE} cursor-pointer appearance-none pe-10`;

/** The 32px blue "حفظ التغييرات" button at the foot of a settings card. */
export const SETTINGS_SUBMIT_BUTTON_CLASSES =
  'h-8 rounded bg-primary px-4 text-[14px]/[20px] font-medium text-white shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-not-allowed disabled:opacity-60';

const OUTLINED_CONTROL_BASE =
  'block h-[38px] w-full rounded border border-text-secondary bg-white ps-4 text-[12px]/[16px] font-bold text-text-primary outline-none placeholder:font-normal placeholder:text-[#94a3b8] focus:border-primary aria-invalid:border-closed';

/** The white outlined 38px box the settings dialogs draw. */
export const SETTINGS_DIALOG_INPUT_CLASSES = `${OUTLINED_CONTROL_BASE} pe-4`;

/** A dialog select, with room on the left for its chevron. */
export const SETTINGS_DIALOG_SELECT_CLASSES = `${OUTLINED_CONTROL_BASE} cursor-pointer appearance-none pe-10`;
