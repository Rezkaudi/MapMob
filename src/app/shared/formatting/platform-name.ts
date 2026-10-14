import { DeliveryPlatform } from '../models/delivery-platform';

type NamedPlatform = Pick<DeliveryPlatform, 'name' | 'latinName'>;

/** The live server sends one name, so both names can be the same word. */
export function hasSeparateLatinName(platform: NamedPlatform): boolean {
  return platform.latinName.trim() !== '' && platform.latinName !== platform.name;
}

export function formatPlatformName(platform: NamedPlatform): string {
  return hasSeparateLatinName(platform)
    ? `${platform.name} (${platform.latinName})`
    : platform.name;
}
