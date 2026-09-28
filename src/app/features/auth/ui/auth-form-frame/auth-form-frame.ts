import { ChangeDetectionStrategy, Component } from '@angular/core';
import { AuthBrandPanel } from '../auth-brand-panel/auth-brand-panel';

/** The two-column sign-in page: brand panel on the right, the form centred on the left. */
@Component({
  selector: 'app-auth-form-frame',
  imports: [AuthBrandPanel],
  templateUrl: './auth-form-frame.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthFormFrame {}
