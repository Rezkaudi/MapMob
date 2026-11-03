import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { PageLockOverlay } from './layout/page-lock-overlay/page-lock-overlay';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, PageLockOverlay],
  templateUrl: './app.html',
})
export class App {}
