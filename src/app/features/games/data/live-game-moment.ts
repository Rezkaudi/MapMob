const SERVER_MOMENT_LENGTH = 'yyyy-mm-dd hh:mm:ss'.length;

/** The server reads the time in the game's own zone, so the moment travels as that zone's wall time. */
export function toServerMoment(zonedIsoMoment: string): string {
  return zonedIsoMoment.replace('T', ' ').slice(0, SERVER_MOMENT_LENGTH);
}
