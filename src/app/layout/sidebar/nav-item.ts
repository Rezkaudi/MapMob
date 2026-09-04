import { Type } from '@angular/core';

export interface NavItem {
  readonly label: string;
  readonly route: string;
  readonly icon: Type<unknown>;
}
