import { HttpContextToken } from '@angular/common/http';

/** Set on writes the user does not wait for, like marking a notification as read. */
export const SKIPS_WRITE_LOCK = new HttpContextToken<boolean>(() => false);
