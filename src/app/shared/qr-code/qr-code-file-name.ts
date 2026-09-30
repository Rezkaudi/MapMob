const FALLBACK_NAME = 'mapmob-store';
const FILE_SUFFIX = '-qr.png';
const UNSAFE_FILE_CHARACTERS = /[\\/:*?"<>|]/g;

export function toQrCodeFileName(storeUrl: string): string {
  return `${readLastPathPart(storeUrl) ?? FALLBACK_NAME}${FILE_SUFFIX}`;
}

function readLastPathPart(storeUrl: string): string | null {
  if (!URL.canParse(storeUrl)) {
    return null;
  }
  const parts = new URL(storeUrl).pathname.split('/').filter((part) => part !== '');
  const lastPart = parts.at(-1);
  return lastPart ? decodeSafely(lastPart).replace(UNSAFE_FILE_CHARACTERS, '-') : null;
}

function decodeSafely(pathPart: string): string {
  try {
    return decodeURIComponent(pathPart);
  } catch {
    return pathPart;
  }
}
