import { ChangeDetectionStrategy, Component, Type, input } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

@Component({
  selector: 'app-stat-card',
  imports: [NgComponentOutlet],
  templateUrl: './stat-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class StatCard {
  readonly icon = input.required<Type<unknown>>();
  readonly label = input.required<string>();
  readonly value = input.required<string | number>();
}
