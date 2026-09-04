import { Pipe, PipeTransform } from '@angular/core';

/** Dates in the design read as "١٢ يناير ٢٠٢٤" — Arabic-Indic digits with Levantine month names. */
const ARABIC_DATE_FORMAT = new Intl.DateTimeFormat('ar-EG', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
  timeZone: 'UTC',
});

@Pipe({ name: 'arabicDate' })
export class ArabicDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    if (!value) {
      return '';
    }
    return ARABIC_DATE_FORMAT.format(new Date(value));
  }
}
