import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { InvalidFormAlert } from './layout/invalid-form-alert/invalid-form-alert';
import { PageLockOverlay } from './layout/page-lock-overlay/page-lock-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageLockOverlay, InvalidFormAlert],
  templateUrl: './app.html',
})
export class App {}
