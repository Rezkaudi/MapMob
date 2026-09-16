import { Pipe, PipeTransform } from '@angular/core';
import { formatSlashDate } from '../formatting/slash-date';

@Pipe({ name: 'slashDate' })
export class SlashDatePipe implements PipeTransform {
  transform(value: string | null | undefined): string {
    return value ? formatSlashDate(value) : '';
  }
}
