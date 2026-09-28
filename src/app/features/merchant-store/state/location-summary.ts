const ARABIC_COMMA = '، ';

/** "طرطوس، شارع الثورة…": the second line of the card on the map. */
export function describeStoreLocation(governorateName: string, address: string): string {
  const trimmedAddress = address.trim();
  return trimmedAddress ? `${governorateName}${ARABIC_COMMA}${trimmedAddress}` : governorateName;
}
