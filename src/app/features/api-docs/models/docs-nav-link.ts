export interface DocsNavLink {
  readonly id: string;
  readonly label: string;
  readonly count?: number;
}

export interface DocsNavGroup {
  readonly title: string;
  readonly links: readonly DocsNavLink[];
}
