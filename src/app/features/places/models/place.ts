import { PlaceStatus } from './place-status';

export interface Place {
  readonly id: string;
  readonly name: string;
  readonly category: string;
  readonly city: string;
  readonly rating: number;
  readonly status: PlaceStatus;
  readonly joinedAt: string;
}
