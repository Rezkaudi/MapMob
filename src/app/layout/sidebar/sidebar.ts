import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { LucideMapPin } from '@lucide/angular';
import { NAV_ITEMS } from './nav-items';

@Component({
  selector: 'app-sidebar',
  imports: [NgComponentOutlet, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Sidebar {
  protected readonly navItems = NAV_ITEMS;
  protected readonly brandIcon = LucideMapPin;
}
