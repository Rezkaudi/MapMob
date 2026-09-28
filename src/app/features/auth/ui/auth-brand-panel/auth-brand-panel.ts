import { ChangeDetectionStrategy, Component } from '@angular/core';

/** The blue brand column that every sign-in screen draws beside its form. */
@Component({
  selector: 'app-auth-brand-panel',
  templateUrl: './auth-brand-panel.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthBrandPanel {}
