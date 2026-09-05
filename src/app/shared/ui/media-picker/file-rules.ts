export interface FileRules {
  readonly maxBytes: number;
  /** MIME types, or a wildcard such as `video/*`. */
  readonly accepted: readonly string[];
  readonly typeMessage: string;
  readonly sizeMessage: string;
}

function matchesType(file: File, accepted: readonly string[]): boolean {
  return accepted.some((pattern) =>
    pattern.endsWith('/*') ? file.type.startsWith(pattern.slice(0, -1)) : file.type === pattern,
  );
}

/** The reason this file cannot be added, ready to show, or null when it is fine. */
export function findFileError(file: File, rules: FileRules): string | null {
  if (!matchesType(file, rules.accepted)) {
    return `${file.name}: ${rules.typeMessage}`;
  }
  if (file.size > rules.maxBytes) {
    return `${file.name}: ${rules.sizeMessage}`;
  }
  return null;
}
