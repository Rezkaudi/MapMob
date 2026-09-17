import { Validators } from '@angular/forms';

/** Digits with an optional leading "+", spaces or dashes, e.g. "+963 933 123 456". */
export const phoneNumber = Validators.pattern(/^\+?[\d\s-]{7,20}$/);

/** Angular's email check lets "a@b" pass; a contact address needs a domain with a dot. */
export const contactEmail = Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);

/** A full web address, as the app opens it in the browser. */
export const webAddress = Validators.pattern(/^https?:\/\/\S+\.\S+$/i);
