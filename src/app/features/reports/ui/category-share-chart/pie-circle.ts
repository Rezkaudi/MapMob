export interface PieCircle {
  readonly centerX: number;
  readonly centerY: number;
  readonly radius: number;
  /** How far out from the centre a label sits, as a part of the radius. */
  readonly labelRadiusRatio: number;
}
