/** Fits a column type into the diagram card. */
const MAX_TYPE_LENGTH = 18;

export function shortColumnType(type: string): string {
  if (type.length <= MAX_TYPE_LENGTH) {
    return type;
  }
  const bracket = type.indexOf('(');
  if (bracket > 0) {
    return `${type.slice(0, bracket)}(…)`;
  }
  return `${type.split(' ')[0]}…`;
}
