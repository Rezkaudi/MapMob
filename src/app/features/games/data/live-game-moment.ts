const SERVER_MOMENT_LENGTH = 'yyyy-mm-dd hh:mm:ss'.length;

/** The server keeps the wall time it is sent and calls it UTC, so the moment travels in UTC. */
export function toServerMoment(isoMoment: string): string {
  return new Date(isoMoment).toISOString().replace('T', ' ').slice(0, SERVER_MOMENT_LENGTH);
}
