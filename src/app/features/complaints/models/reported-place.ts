export interface ReportedPlace {
  readonly id: string;
  readonly name: string;
  readonly categoryName: string;
  readonly address: string;
  readonly rating: number;
  readonly reviewCount: number;
  readonly imageUrl: string | null;
}
