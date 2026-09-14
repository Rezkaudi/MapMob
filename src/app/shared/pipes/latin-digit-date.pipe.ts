import { Pipe, PipeTransform } from '@angular/core';

/** The user detail page writes dates as "02 سبتمبر 2026": Latin digits, Arabic month names. */
const LATIN_DIGIT_DATE_FORMAT = new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
  day: '2-digit',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

@Pipe({ name: 'latinDigitDate' })
export class LatinDigitDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    return LATIN_DIGIT_DATE_FORMAT.format(new Date(value));
  }
}
