/** How the /owner routes write on and off. */
export const LIVE_ACTIVE = 'active';
export const LIVE_INACTIVE = 'inactive';

export function liveOwnerStatusOf(isOn: boolean): string {
  return isOn ? LIVE_ACTIVE : LIVE_INACTIVE;
}
