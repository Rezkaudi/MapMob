import { ShareBarTone } from '../../../shared/ui/share-bar/share-bar-tone';

/** Picks the tone for a row by its place, starting over when the rows outnumber the tones. */
export function pickToneInOrder(tones: readonly ShareBarTone[], index: number): ShareBarTone {
  return tones[index % tones.length];
}
