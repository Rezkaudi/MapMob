import { Pipe, PipeTransform } from '@angular/core';
import { formatArabicDate } from '../formatting/arabic-date';

@Pipe({ name: 'arabicDate' })
export class ArabicDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    return value ? formatArabicDate(value) : '';
  }
}
