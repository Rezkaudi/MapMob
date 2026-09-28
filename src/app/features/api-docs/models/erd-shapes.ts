import { DbTable } from './db-table';

export interface ErdPoint {
  readonly x: number;
  readonly y: number;
}

export interface ErdCard {
  readonly table: DbTable;
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export interface ErdLink {
  readonly id: string;
  readonly from: ErdPoint;
  readonly to: ErdPoint;
  readonly path: string;
}

export interface ErdSize {
  readonly width: number;
  readonly height: number;
}
