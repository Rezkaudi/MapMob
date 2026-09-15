export interface ReviewedPlace {
  /** The short number the admins quote, shown as "ID: #4920". */
  readonly referenceNumber: number;
  readonly name: string;
  readonly categoryName: string;
  readonly governorateName: string;
  readonly areaName: string;
}
