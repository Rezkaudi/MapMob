import { drawQrCode, measureQrCodeImage } from './draw-qr-code';

interface FilledBox {
  readonly color: string;
  readonly box: readonly number[];
}

function createRecordingContext() {
  const filled: FilledBox[] = [];
  const context = {
    fillStyle: '',
    fillRect(x: number, y: number, width: number, height: number) {
      filled.push({ color: String(this.fillStyle), box: [x, y, width, height] });
    },
  };
  return { context, filled };
}

describe('measureQrCodeImage', () => {
  it('adds the 4-module quiet zone on each side', () => {
    expect(measureQrCodeImage([[true]], 10)).toBe(90);
  });
});

describe('drawQrCode', () => {
  it('paints the whole picture white, then each dark module black inside the quiet zone', () => {
    const { context, filled } = createRecordingContext();

    drawQrCode(
      context,
      [
        [true, false],
        [false, true],
      ],
      10,
    );

    expect(filled).toEqual([
      { color: '#ffffff', box: [0, 0, 100, 100] },
      { color: '#000000', box: [40, 40, 10, 10] },
      { color: '#000000', box: [50, 50, 10, 10] },
    ]);
  });
});
