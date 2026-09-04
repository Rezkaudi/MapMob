export interface UserMenuItem {
  readonly label: string;
  /** Matches a file in `public/assets/icons`. */
  readonly icon: string;
  readonly route: string;
}
