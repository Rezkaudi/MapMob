import { Validators } from '@angular/forms';

/** Rejects a value made of spaces only. */
export const hasText = Validators.pattern(/\S/);
