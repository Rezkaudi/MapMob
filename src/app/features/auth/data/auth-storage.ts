import { Injectable } from '@angular/core';
import { AuthenticatedUser } from '../models/authenticated-user';

const STORAGE_KEY = 'mapmob.auth.user';

/** Keeps the signed-in user in localStorage so a reload does not sign the admin out. */
@Injectable({ providedIn: 'root' })
export class AuthStorage {
  read(): AuthenticatedUser | null {
    const raw = this.storage()?.getItem(STORAGE_KEY);
    if (!raw) {
      return null;
    }
    try {
      return JSON.parse(raw) as AuthenticatedUser;
    } catch {
      this.clear();
      return null;
    }
  }

  save(user: AuthenticatedUser): void {
    this.storage()?.setItem(STORAGE_KEY, JSON.stringify(user));
  }

  clear(): void {
    this.storage()?.removeItem(STORAGE_KEY);
  }

  // Private browsing and server-side rendering can leave us without localStorage.
  private storage(): Storage | null {
    try {
      return localStorage;
    } catch {
      return null;
    }
  }
}
