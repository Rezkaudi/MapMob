import { PieCircle } from './pie-circle';
import { PieSlice } from './pie-slice';

const FULL_TURN = 2 * Math.PI;
const HALF = 0.5;
const COORDINATE_DECIMALS = 2;

interface Point {
  readonly x: number;
  readonly y: number;
}

function formatCoordinate(value: number): string {
  // Adding 0 turns -0 into 0, so a path never prints "-0".
  return `${Number(value.toFixed(COORDINATE_DECIMALS)) + 0}`;
}

function pointAt(circle: PieCircle, angle: number, distance: number): Point {
  return {
    x: circle.centerX + distance * Math.cos(angle),
    y: circle.centerY + distance * Math.sin(angle),
  };
}

function formatPoint(point: Point): string {
  return `${formatCoordinate(point.x)} ${formatCoordinate(point.y)}`;
}

function buildWholeCirclePath(circle: PieCircle): string {
  const { radius } = circle;
  const start = formatPoint(pointAt(circle, 0, radius));
  const opposite = formatPoint(pointAt(circle, Math.PI, radius));
  const arc = `A ${radius} ${radius} 0 1 1`;
  return `M ${start} ${arc} ${opposite} ${arc} ${start} Z`;
}

function buildSlicePath(
  circle: PieCircle,
  startAngle: number,
  endAngle: number,
  part: number,
): string {
  const { radius } = circle;
  const center = formatPoint({ x: circle.centerX, y: circle.centerY });
  const start = formatPoint(pointAt(circle, startAngle, radius));
  const end = formatPoint(pointAt(circle, endAngle, radius));
  const largeArcFlag = part > HALF ? 1 : 0;
  return `M ${center} L ${start} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${end} Z`;
}

/** Slices start at three o'clock and turn clockwise, as SVG's y axis points down. */
export function buildPieSlices(shares: readonly number[], circle: PieCircle): readonly PieSlice[] {
  const total = shares.reduce((sum, share) => sum + share, 0);
  if (total <= 0) {
    return [];
  }

  let startAngle = 0;
  return shares.map((share) => {
    const part = share / total;
    const endAngle = startAngle + part * FULL_TURN;
    const label = pointAt(
      circle,
      (startAngle + endAngle) / 2,
      circle.radius * circle.labelRadiusRatio,
    );
    const path =
      part === 1
        ? buildWholeCirclePath(circle)
        : buildSlicePath(circle, startAngle, endAngle, part);
    startAngle = endAngle;
    return { path, labelX: label.x, labelY: label.y };
  });
}
