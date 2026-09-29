/** An ordering app the admins list, such as BeeOrder or Talabat. */
export interface DeliveryPlatform {
  readonly id: string;
  readonly name: string;
  /** The brand as written in Latin letters, shown in brackets after the name. */
  readonly latinName: string;
  readonly logoUrl: string | null;
}
