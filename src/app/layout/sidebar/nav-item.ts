export interface NavItem {
  readonly label: string;
  readonly route: string;
  /** Matches a file in `public/assets/icons`. */
  readonly icon: string;
}
