import { Pipe, PipeTransform } from '@angular/core';
import { formatLatinDigitDate } from '../formatting/latin-digit-date';

@Pipe({ name: 'latinDigitDate' })
export class LatinDigitDatePipe implements PipeTransform {
  transform(value: string | Date | null | undefined): string {
    return value ? formatLatinDigitDate(value) : '';
  }
}
