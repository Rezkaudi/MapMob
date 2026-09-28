import { ControlEvent } from '@angular/forms';
import { Observable } from 'rxjs';
import { OfferFormControls } from './offer-form-controls';

/** Any form group holding the shared offer controls, with or without extra ones. */
export interface OfferFieldsForm {
  readonly controls: OfferFormControls;
  readonly events: Observable<ControlEvent>;
  hasError(errorCode: string): boolean;
}
